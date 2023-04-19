using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using NetUtility;
using Line2u.Constants;
using Line2u.Data;
using Line2u.DTO;
using Line2u.Helpers;
using Line2u.Models;
using Line2u.Services.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Microsoft.AspNetCore.Http;
using Syncfusion.JavaScript;
using Syncfusion.JavaScript.DataSources;
using Org.BouncyCastle.Crypto;
using static Line2u.Constants.SP;
using OpenAI_API.Embedding;

namespace Line2u.Services
{
    public interface IOrderService : IServiceBase<Order, OrderDto>
    {
        Task<object> LoadData(DataManager data, string lang,string uid);
        Task<object> GetByGuid(string guid);
        Task<object> GetAudit(object id);
        Task<object> DeleteUploadFile(decimal key);
        Task<OperationResult> AddFormAsync(OrderDto model);
        Task<OperationResult> UpdateOrderDetail(OrderDetailDto model);
        Task<OperationResult> MinusOrderDetail(OrderDetailDto model);
        Task<OperationResult> DeleteOrderDetail(OrderDetailDto model);
        Task<OperationResult> UpdateFormAsync(OrderDto model);

        Task<object> GetWebNews();
        Task<object> GetProducts(string id);
        Task<object> GetTrackingOrderForStore(string id, DateTime min, DateTime max);
        Task<object> GetTrackingOrderForStoreWithTime(DateTime min, DateTime max);
        Task<object> GetTrackingOrderUser(int id);
        Task<object> GetDetailOrder(string id,string storeGuid);
        Task<OperationResult> ConfirmOrder(string id);
        Task<OperationResult> CancelOrder(string id);
        Task<object> GetWebPages();
        
    }
    public class OrderService : ServiceBase<Order, OrderDto>, IOrderService, IScopeService
    {
        private readonly IRepositoryBase<Order> _repo;
        private readonly IRepositoryBase<ProductSize> _repoProductSize;
        private readonly IRepositoryBase<ProductOption> _repoProductOption;
        private readonly IRepositoryBase<StoreProfile> _repoStoreProfile;
        private readonly IRepositoryBase<Product> _repoProduct;
        private readonly IRepositoryBase<Cart> _repoCart;
        private readonly IRepositoryBase<OrderDetail> _repoOrderDetail;
        private readonly IRepositoryBase<MainCategory> _repoMainCategory;
        private readonly IRepositoryBase<CodeType> _repoCodeType;
        private readonly IRepositoryBase<XAccount> _repoXAccount;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ISPService _spService;
        private readonly MapperConfiguration _configMapper;
private readonly ILine2uLoggerService _logger;
        private readonly IWebHostEnvironment _currentEnvironment;

        public OrderService(
            IRepositoryBase<Order> repo,
             IRepositoryBase<ProductSize> repoProductSize,
            IRepositoryBase<ProductOption> repoProductOption,
            IRepositoryBase<StoreProfile> repoStoreProfile,
            IRepositoryBase<Cart> repoCart,
            IRepositoryBase<Product> repoProduct,
            IRepositoryBase<OrderDetail> repoOrderDetail,
            IRepositoryBase<MainCategory> repoMainCategory,
            IRepositoryBase<CodeType> repoCodeType,
            IRepositoryBase<XAccount> repoXAccount,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            MapperConfiguration configMapper,
ILine2uLoggerService logger
,
IWebHostEnvironment currentEnvironment
,
ISPService spService)
            : base(repo, logger, unitOfWork, mapper, configMapper)
        {
            _repo = repo;
            _repoProductSize = repoProductSize;
            _repoProductOption = repoProductOption;
            _repoStoreProfile = repoStoreProfile;
            _repoCart = repoCart;
            _repoProduct = repoProduct;
            _repoOrderDetail = repoOrderDetail;
            _repoMainCategory = repoMainCategory;
            _repoCodeType = repoCodeType;
            _logger = logger;
            _currentEnvironment = currentEnvironment;
            _repoXAccount = repoXAccount;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configMapper = configMapper;
            _spService = spService;
        }
        public async Task<object> GetByGuid(string guid)
        {
            return await _repo.FindAll(x => x.Guid == guid).ToListAsync();
        }
        public async Task<object> LoadData(DataManager data, string lang, string uid)
        {
            var datasource =  _repo.FindAll(o => o.Guid == uid).OrderByDescending(x => x.Id).AsQueryable();

            var count = await datasource.CountAsync();
            if (data.Where != null) // for filtering
                datasource = QueryableDataOperations.PerformWhereFilter(datasource, data.Where, data.Where[0].Condition);
            if (data.Sorted != null)//for sorting
                datasource = QueryableDataOperations.PerformSorting(datasource, data.Sorted);
            if (data.Search != null)
                datasource = QueryableDataOperations.PerformSearching(datasource, data.Search);
            count = await datasource.CountAsync();
            if (data.Skip >= 0)//for paging
                datasource = QueryableDataOperations.PerformSkip(datasource, data.Skip);
            if (data.Take > 0)//for paging
                datasource = QueryableDataOperations.PerformTake(datasource, data.Take);
            return new
            {
                Result = await datasource.ToListAsync(),
                Count = count
            };
        }
        public override async Task<OperationResult> AddAsync(OrderDto model)
        {
            var item = _mapper.Map<Order>(model);
            item.Status = StatusConstants.Default;
            _repo.Add(item);
            try
            {
                await _unitOfWork.SaveChangeAsync();
                // order detail
                var list_order_detail = new List<OrderDetail>();
                foreach (var item_products in model.Products)
                {
                    var item_add = new OrderDetail()
                    {
                        OrderGuid = item.Guid,
                        Price = item_products.ProductPrice.ToDecimal(),
                        Quantity = item_products.Quantity,
                        ProductGuid = item_products.ProductGuid,
                        ProductSize = item_products.ProductSizeAdd,
                        ProductOption = item_products.ProductOptionAdd,
                        PendingStatus  = true,
                        AccountId = model.AccountId,
                        StoreGuid = item_products.storeGuid,
                    };
                    var item_cart = _repoCart.FindByID(item_products.Id);
                    item_cart.IsCheckout = 1;
                    _repoCart.Update(item_cart);
                    list_order_detail.Add(item_add);
                }
                _repoOrderDetail.AddRange(list_order_detail);
                ///update lai cart
                ///


                await _unitOfWork.SaveChangeAsync();
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.AddSuccess,
                    Success = true,
                    Data = item
                };
            }
            catch (Exception ex)
            {
                    await _logger.LogStoreProcedure(new LoggerParams {
                    Type= Line2uLogConst.Create,
                    LogText = $"Type: { ex.GetType().Name}, Message: { ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }
        public override async Task<OrderDto> GetByIDAsync(object id)
        {
            var item = await _repo.FindByIDAsync(id);
            var author =  _repoXAccount.FindByID(item.CreateBy);
            var result = new OrderDto()
            {
                Id = item.Id,
                CreateBy = item.CreateBy,
                CreateDate = item.CreateDate,
                Guid = item.Guid,
                Status = item.Status,
                UpdateBy = item.UpdateBy,
                UpdateDate = item.UpdateDate,
            };
            return result;
        }
        public override async Task<OperationResult> UpdateAsync(OrderDto model)
        {
            var item = _mapper.Map<Order>(model);
            _repo.Update(item);
            try
            {
                await _unitOfWork.SaveChangeAsync();
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.UpdateSuccess,
                    Success = true,
                    Data = item
                };
            }
            catch (Exception ex)
            {
                    await _logger.LogStoreProcedure(new LoggerParams {
                    Type= Line2uLogConst.Update,
                    LogText = $"Type: { ex.GetType().Name}, Message: { ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }
        public override async Task<List<OrderDto>> GetAllAsync()
        {
            var query = _repo.FindAll(x=> x.Status == StatusConstants.Default).ProjectTo<OrderDto>(_configMapper);

            var data = await query.OrderByDescending(x=>x.Id).ToListAsync();
            return data;

        }
        public override async Task<OperationResult> DeleteAsync(object id)
        {
            var item = _repo.FindByID(id.ToDecimal());
            item.Status = StatusConstants.Delete3;
            _repo.Update(item);
            try
            {
                await _unitOfWork.SaveChangeAsync();
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.DeleteSuccess,
                    Success = true,
                    Data = item
                };
            }
            catch (Exception ex)
            {
                    await _logger.LogStoreProcedure(new LoggerParams {
                    Type= Line2uLogConst.Delete,
                    LogText = $"Type: { ex.GetType().Name}, Message: { ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }
     
        public async Task<object> GetAudit(object id)
        {
            var data = await _repo.FindAll(x => x.Id.Equals(id)).AsNoTracking().Select(x=> new {x.UpdateBy, x.CreateBy, x.UpdateDate, x.CreateDate }).FirstOrDefaultAsync();
            string createBy = "N/A";
            string createDate = "N/A";
            string updateBy = "N/A";
            string updateDate = "N/A";
            if (data == null)
                return new
                {
                    createBy,
                    createDate,
                    updateBy,
                    updateDate
                };
            if (data.UpdateBy.HasValue)
            {
                var updateAudit = await _repoXAccount.FindAll(x => x.AccountId == data.UpdateBy).AsNoTracking().Select(x=> new { x.Uid }).FirstOrDefaultAsync();
                updateBy = updateAudit != null && updateBy != null ? updateAudit.Uid : "N/A";
                updateDate = data.UpdateDate.HasValue ? data.UpdateDate.Value.ToString("yyyy/MM/dd HH:mm:ss") : "N/A";
            }
            if (data.CreateBy.HasValue)
            {
                var createAudit = await _repoXAccount.FindAll(x => x.AccountId == data.CreateBy).AsNoTracking().Select(x => new { x.Uid }).FirstOrDefaultAsync();
                createBy = createAudit != null && createAudit != null ? createAudit.Uid : "N/A";
                createDate = data.CreateDate.HasValue ? data.CreateDate.Value.ToString("yyyy/MM/dd HH:mm:ss") : "N/A";
            }
            return new
            {
                createBy,
                createDate,
                updateBy,
                updateDate
            };
        }

        public async Task<OperationResult> AddFormAsync(OrderDto model)
        {
          
            FileExtension fileExtension = new FileExtension();
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\Products\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);
            //if (model.File != null)
            //{
            //    IFormFile files = model.File.FirstOrDefault();
            //    if (!files.IsNullOrEmpty())
            //    {
            //        avatarUniqueFileName = await fileExtension.WriteAsync(files, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
            //        model.PhotoPath = $"/FileUploads/images/Products/avatar/{avatarUniqueFileName}";
            //    }
            //}
            try
            {
                var item = _mapper.Map<Order>(model);
                // item.Status = StatusConstants.Default;
                _repo.Add(item);
                await _unitOfWork.SaveChangeAsync();

                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.AddSuccess,
                    Success = true,
                    Data = model
                };
            }
            catch (Exception ex)
            {
                await _logger.LogStoreProcedure(new LoggerParams
                {
                    Type = Line2uLogConst.Create,
                    LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                if (!avatarUniqueFileName.IsNullOrEmpty())
                    fileExtension.Remove($"{uploadAvatarFolder}\\{avatarUniqueFileName}");

                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

    
        public async Task<OperationResult> UpdateFormAsync(OrderDto model)
        {

            FileExtension fileExtension = new FileExtension();
           
            var item = _mapper.Map<Order>(model);


            // Nếu có đổi ảnh thì xóa ảnh cũ và thêm ảnh mới
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\Products\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);

            //if (model.File != null)
            //{
            //    IFormFile filesAvatar = model.File.FirstOrDefault();
            //    if (!filesAvatar.IsNullOrEmpty())
            //    {
            //        if (!item.PhotoPath.IsNullOrEmpty())
            //            fileExtension.Remove($"{_currentEnvironment.WebRootPath}{item.PhotoPath.Replace("/", "\\").Replace("/", "\\")}");
            //        avatarUniqueFileName = await fileExtension.WriteAsync(filesAvatar, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
            //        item.PhotoPath = $"/FileUploads/images/Products/avatar/{avatarUniqueFileName}";
            //    }
            //}

            try
            {

                _repo.Update(item);
                await _unitOfWork.SaveChangeAsync();

                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.UpdateSuccess,
                    Success = true,
                    Data = model
                };
            }
            catch (Exception ex)
            {
                await _logger.LogStoreProcedure(new LoggerParams
                {
                    Type = Line2uLogConst.Update,
                    LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                // Nếu tạo ra file rồi mã lưu db bị lỗi thì xóa file vừa tạo đi
                if (!avatarUniqueFileName.IsNullOrEmpty())
                    fileExtension.Remove($"{uploadAvatarFolder}\\{avatarUniqueFileName}");

                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }


        public async Task<object> DeleteUploadFile(decimal key)
        {
            try
            {
                //var item = await _repo.FindByIDAsync(key);
                //if (item != null)
                //{
                //    string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, item.PhotoPath);
                //    FileExtension fileExtension = new FileExtension();
                //    var avatarUniqueFileName = item.PhotoPath;
                //    if (!avatarUniqueFileName.IsNullOrEmpty())
                //    {
                //        var result = fileExtension.Remove($"{_currentEnvironment.WebRootPath}\\{item.PhotoPath}");
                //        if (result)
                //        {
                //            item.PhotoPath = string.Empty;
                //            _repo.Update(item);
                //            await _unitOfWork.SaveChangeAsync();
                //        }
                //    }
                //}


                return new { status = true };
            }
            catch (Exception ex)
            {
                await _logger.LogStoreProcedure(new LoggerParams
                {
                    Type = Line2uLogConst.Delete,
                    LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                return new { status = true };
            }
        }

        public async Task<object> GetWebNews()
        {
           return await _spService.GetWebNews();
        }

        public async Task<object> GetWebPages()
        {
           return await _spService.GetWebPages();
        }

        public async Task<object> GetProducts(string category_guid)
        {
            var category = await _repoMainCategory.FindAll(o => o.Guid == category_guid).ToListAsync();
            var products = await _repo.FindAll().ToListAsync();
            var result = (from x in category
                          let y = products.Where(o => o.Guid == x.Guid).ToList()
                          select new
                          {
                              category = x.CategoryName,
                              list_product = y
                          }).ToList();
            return result;
        }

        public async Task<object> GetTrackingOrderForStore(string storeGuid, DateTime min, DateTime max)
        {
            var result = _repoOrderDetail.FindAll(o => o.StoreGuid == storeGuid).DistinctBy(o => o.OrderGuid).ToList();
            var list_data = new List<Order>();

            foreach (var item in result)
            {
                var item_add = await _repo.FindAll(o => o.Guid == item.OrderGuid).FirstOrDefaultAsync();
                list_data.Add(item_add);
            }

            return list_data.Where(x => x.CreateDate.Value.Date >= min.Date && x.CreateDate.Value.Date <= max.Date).OrderByDescending(x => x.CreateDate);
        }

        public async Task<object> GetTrackingOrderUser(int accountId)
        {
            var order = await _repo.FindAll(o => o.AccountId == accountId.ToString()).ToListAsync();
            var order_detail = await _repoOrderDetail.FindAll().ToListAsync();
            var products = await _repoProduct.FindAll().ToListAsync();
            var store = await _repoStoreProfile.FindAll().ToListAsync();
            var result = (from x in order
                          let y = order_detail.Where(o => o.OrderGuid == x.Guid).ToList()
                          select new
                          {
                              orderID = x.Guid,
                              orderDate = x.CreateDate,
                              orderPayment = x.PaymentType,
                              orderTotal = x.TotalPrice,
                              list_store = getListStoreTrackingOrderUser(y).Result
                          }).DistinctBy(o => o.orderID).OrderByDescending(o => o.orderDate).ToList();


            return result;
        }

        //public async Task<object> GetThuDataChoTrucCuTo(int accountId)
        //{

        //    var data = data.DistinctBy(sa => sa.FundNumber).ToList();
        //    var result = (from x in data
        //                  let AcceptedCharges = data.Where(o => o.FundNumber == x.FundNumber && o.acceptedStatus.Equals(o..StatusDescription)).ToList()
        //                  select new
        //                  {
        //                      FundNumber = x.Key,
        //                      AcceptedCharges = AcceptedCharges.sum(sa => sa.PreEnrolledCharges)
        //                  }).ToList();


        //    return result;
        //}
        //var result = await data
        //        .GroupBy(sa => sa.FundNumber)
        //        .Select(g => new SpecialAssessmentSummaryDto
        //        {
        //            FundNumber = g.Key,
        //            AcceptedCharges = g.Where(sa => acceptedStatus.Equals(sa.StatusDescription)).Sum(sa => sa.PreEnrolledCharges),
        //            AcceptedRecords = g.Count(sa => acceptedStatus.Equals(sa.StatusDescription)),
        //            RejectedRecords = g.Count(sa => !acceptedStatus.Equals(sa.StatusDescription))
        //        })

        private async Task<object> getListStoreTrackingOrderUser(List<OrderDetail> data)
        {
            var products = _repoProduct.FindAll().ToList();
            var store = await _repoStoreProfile.FindAll().ToListAsync();
            var list = new List<object>();
            foreach (var product in data.DistinctBy(o => o.StoreGuid))
            {
                var item = products.Where(o => o.Guid == product.ProductGuid).FirstOrDefault();
                var list_order_detail_by_store = _repoOrderDetail.FindAll(x => x.StoreGuid == product.StoreGuid && x.OrderGuid == product.OrderGuid).ToList();
                var storeProfile = store.Where(o => o.Guid == product.StoreGuid).FirstOrDefault();
                var item_add = new
                {
                    
                    storeName = storeProfile != null ? storeProfile.StoreName : "N/A",
                    list_products = getListProductsTrackingOrderUser(list_order_detail_by_store).Result
                
                };

                list.Add(item_add);
            }

            return list;
        }

        private async Task<object> getListProductsTrackingOrderUser(List<OrderDetail> data)
        {
            var products = _repoProduct.FindAll().ToList();
            var list = new List<object>();
            foreach (var product in data)
            {
                var item = products.Where(o => o.Guid == product.ProductGuid).FirstOrDefault();
                var pro_size = _repoProductSize.FindAll().ToList();
                var pro_option = _repoProductOption.FindAll().ToList();
                var item_add = new
                {
                    ProductName = item.ProductName,
                    PhotoPath = item.PhotoPath,
                    item.ProductDescription,
                    item.Id,
                    productPrice = product.Price,
                    Guid = item.Guid,
                    Qty = product.Quantity,
                    totalOrder = product.Quantity,
                    ProductSize = pro_size.Where(o => o.Id == product.ProductSize).FirstOrDefault() != null
                             ? pro_size.Where(o => o.Id == product.ProductSize).FirstOrDefault().Price.ToDouble() : 0,
                    ProductOption = calculator(product.ProductOption),
                    //ProductOption = pro_option.Where(o => o.Id == product.ProductOption).FirstOrDefault() != null
                    //         ? pro_option.Where(o => o.Id == product.ProductOption).FirstOrDefault().Price.ToDouble() : 0,
                    Price = product.Quantity * product.Price
                };

                list.Add(item_add);
            }

            return list;
        }
        //public async Task<object> GetTrackingOrderUser(int accountId)
        //{
        //    var order = await _repo.FindAll(o => o.AccountId == accountId.ToString()).ToListAsync();
        //    var order_detail = await _repoOrderDetail.FindAll().ToListAsync();
        //    var products = await _repoProduct.FindAll().ToListAsync();
        //    var store = await _repoStoreProfile.FindAll().ToListAsync();
        //    var result = (from x in order
        //                  join y in order_detail on x.Guid equals y.OrderGuid
        //                  let z = products.Where(o => o.Guid == y.ProductGuid).ToList()
        //                  let storeProfile = store.Where(o => o.Guid == y.StoreGuid).FirstOrDefault()
        //                  select new
        //                  {
        //                      orderID = x.Guid,
        //                      orderDate = x.CreateDate,
        //                      storeName = storeProfile != null ? storeProfile.StoreName : "N/A",
        //                      orderPayment = x.PaymentType,
        //                      orderTotal = y.Quantity * y.Price,
        //                      list_product = z.Select(o => new {
        //                          o.ProductName,
        //                          o.PhotoPath,
        //                          price = y.Quantity * y.Price,
        //                          qty = y.Quantity
        //                      })
        //                  }).OrderByDescending(x => x.orderDate).ToList();


        //    return result;
        //}
        private async Task<object> getListProducts(List<OrderDetail> data)
        {
            var pro_size = _repoProductSize.FindAll().ToList();
            var pro_option = _repoProductOption.FindAll().ToList();
            var products = _repoProduct.FindAll().ToList();
            var store = await _repoStoreProfile.FindAll().ToListAsync();
            var list = new List<object>();
            foreach (var product in data)
            {
                var item = products.Where(o => o.Guid == product.ProductGuid).FirstOrDefault();
                var storeProfile = store.Where(o => o.Guid == product.StoreGuid).FirstOrDefault();
                var item_add = new
                {
                    ProductName = item.ProductName,
                    PhotoPath = item.PhotoPath,
                    item.ProductDescription,
                    item.Id,
                    storeName = storeProfile != null ? storeProfile.StoreName : "N/A",
                    productPrice = product.Price,
                    ProductSize = pro_size.Where(o => o.Id == product.ProductSize).FirstOrDefault() != null
                             ? pro_size.Where(o => o.Id == product.ProductSize).FirstOrDefault().Price.ToDouble() : 0,
                    ProductOption = calculator(product.ProductOption),
                    //ProductOption = pro_option.Where(o => o.Id == product.ProductOption).FirstOrDefault() != null
                    //         ? pro_option.Where(o => o.Id == product.ProductOption).FirstOrDefault().Price.ToDouble() : 0,
                    Guid = item.Guid,
                    Qty = product.Quantity,
                    totalOrder = product.Quantity,
                    Price = product.Quantity * product.Price
                };
                    
                //    .Select(x => new {
                //    ProductName = x.ProductName,
                //    PhotoPath = x.PhotoPath,
                //    Price = product.Quantity * product.Price
                //});
                list.Add(item_add);
            }

            return list;
        }
        private double calculator(string item)
        {
            double result = 0;
            double result_tamp = 0;
            var items = item.Split(',');
            foreach (var item_plit in items)
            {
                var option = _repoProductOption.FindByID(item_plit.ToDecimal()).Price;
                if (option != null)
                {
                    result_tamp = result_tamp + option.ToDouble();
                }
            }
            return result_tamp;
        }
        public async Task<object> GetDetailOrder(string id, string storeGuid)
        {
           
            var order = await _repo.FindAll(o => o.Guid == id).ToListAsync();
            var order_detail = await _repoOrderDetail.FindAll().ToListAsync();
            var products = await _repoProduct.FindAll().ToListAsync();
            var result = (from x in order
                          let y = order_detail.Where(o => o.OrderGuid == x.Guid && o.StoreGuid == storeGuid).ToList()
                          select new
                          {
                              orderID = x.Guid,
                              order_date = x.CreateDate,
                              order_By = x.AccountId.ToInt(),
                              order_table = string.IsNullOrEmpty(x.TableNo) ? "N/A" : x.TableNo,
                              Pay_Method = x.PaymentType,
                              product_total_price = x.TotalPrice,
                              list_product = getListProducts(y).Result
                          }).DistinctBy(o => o.orderID).FirstOrDefault();


            return result;
        }

        public async Task<object> GetTrackingOrderForStoreWithTime(DateTime min, DateTime max)
        {
            throw new NotImplementedException();
        }

        public async Task<OperationResult> ConfirmOrder(string id)
        {
            var model = await _repo.FindAll(o => o.Guid == id).FirstOrDefaultAsync();
            var item = _mapper.Map<Order>(model);
            item.IsPayment = "Paid";
            _repo.Update(item);
            try
            {
                await _unitOfWork.SaveChangeAsync();
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.UpdateSuccess,
                    Success = true,
                    Data = item
                };
            }
            catch (Exception ex)
            {
                await _logger.LogStoreProcedure(new LoggerParams
                {
                    Type = Line2uLogConst.Update,
                    LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

        public async Task<OperationResult> CancelOrder(string id)
        {
            var model = await _repo.FindAll(o => o.Guid == id).FirstOrDefaultAsync();
            var item = _mapper.Map<Order>(model);
            item.IsPayment = "Cancel";
            try
            {
                await _unitOfWork.SaveChangeAsync();
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.UpdateSuccess,
                    Success = true,
                    Data = item
                };
            }
            catch (Exception ex)
            {
                await _logger.LogStoreProcedure(new LoggerParams
                {
                    Type = Line2uLogConst.Update,
                    LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

        public async Task<OperationResult> UpdateOrderDetail(OrderDetailDto model)
        {
            var check_item = _repoOrderDetail.FindAll(o => o.ProductGuid == model.ProductGuid
            && o.StoreGuid == model.StoreGuid
            && o.AccountId == model.AccountId
            && o.OrderGuid == model.OrderGuid
            && o.CreateDate.Value.Date == model.CreateDate.Value.Date
            ).FirstOrDefault();
            if (check_item != null)
            {
                check_item.Quantity = check_item.Quantity + 1;
                _repoOrderDetail.Update(check_item);
                // update order detail

                var order = _repo.FindAll(o => o.Guid == model.OrderGuid).FirstOrDefault();
                order.TotalPrice = order.TotalPrice + model.Price;
                _repo.Update(order);
            }
            else
            {
                var item = _mapper.Map<OrderDetail>(model);
                item.Id = 0;
                item.Status = StatusConstants.Default;
                _repoOrderDetail.Update(item);
                // update order detail
                var order = _repo.FindAll(o => o.Guid == model.OrderGuid).FirstOrDefault();
                order.TotalPrice = order.TotalPrice + model.Price;
                _repo.Update(order);
            }
            try
            {
                await _unitOfWork.SaveChangeAsync();

                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.AddSuccess,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                await _logger.LogStoreProcedure(new LoggerParams
                {
                    Type = Line2uLogConst.Create,
                    LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

        public async Task<OperationResult> MinusOrderDetail(OrderDetailDto model)
        {
            var check_item = _repoOrderDetail.FindAll(o => o.ProductGuid == model.ProductGuid
            && o.StoreGuid == model.StoreGuid
            && o.AccountId == model.AccountId
            && o.OrderGuid == model.OrderGuid
            && o.CreateDate.Value.Date == model.CreateDate.Value.Date
            ).FirstOrDefault();
            if (check_item != null)
            {
                check_item.Quantity = model.Quantity;
                _repoOrderDetail.Update(check_item);

                // update order detail
                var order = _repo.FindAll(o => o.Guid == model.OrderGuid).FirstOrDefault();
                order.TotalPrice = order.TotalPrice - model.Price;
                _repo.Update(order);
            }
            
            try
            {
                await _unitOfWork.SaveChangeAsync();

                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.AddSuccess,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                await _logger.LogStoreProcedure(new LoggerParams
                {
                    Type = Line2uLogConst.Create,
                    LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

        public async Task<OperationResult> DeleteOrderDetail(OrderDetailDto model)
        {
            var check_item = _repoOrderDetail.FindAll(o => o.ProductGuid == model.ProductGuid
            && o.StoreGuid == model.StoreGuid
            && o.AccountId == model.AccountId
            && o.OrderGuid == model.OrderGuid
            && o.CreateDate.Value.Date == model.CreateDate.Value.Date
            ).FirstOrDefault();
            if (check_item != null)
            {
                _repoOrderDetail.Remove(check_item);

                // update order detail
                var order = _repo.FindAll(o => o.Guid == model.OrderGuid).FirstOrDefault();
                order.TotalPrice = order.TotalPrice - (model.Price * model.Quantity);
                _repo.Update(order);
            }
           
            try
            {
                await _unitOfWork.SaveChangeAsync();

                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.AddSuccess,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                await _logger.LogStoreProcedure(new LoggerParams
                {
                    Type = Line2uLogConst.Create,
                    LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }
    }
}
