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
using Microsoft.AspNetCore.Mvc;
using Syncfusion.JavaScript.Models;
using Castle.Core.Internal;

namespace Line2u.Services
{
    public interface ICartService : IServiceBase<Cart, CartDto>
    {
        Task<object> LoadData(DataManager data, string lang,string uid);
        Task<object> GetByGuid(string guid);
        Task<object> GetAudit(object id);
        Task<object> DeleteUploadFile(decimal key);
        Task<OperationResult> AddFormAsync(CartDto model);
        Task<OperationResult> UpdateFormAsync(CartDto model);

        Task<object> GetWebNews();
        Task<object> GetProducts(string id);
        Task<object> GetTrackingOrderForStore(string id);
        Task<object> GetTrackingOrderUser(int id);
        Task<object> GetDetailOrder(string id);
        Task<object> GetProductsInCart(string accountGuid);

        Task<double> CartAmountTotal(string accountGuid);
        Task<object> CartAmountTotal2(string accountGuid);
        Task<int> CartCountTotal(string accountGuid);
        Task<object> GetWebPages();
        
    }
    public class CartService : ServiceBase<Cart, CartDto>, ICartService, IScopeService
    {
        private readonly IRepositoryBase<Cart> _repo;
        private readonly IRepositoryBase<ProductSize> _repoProductSize;
        private readonly IRepositoryBase<ProductOption> _repoProductOption;
        private readonly IRepositoryBase<Product> _repoProduct;
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

        public CartService(
            IRepositoryBase<Cart> repo,
             IRepositoryBase<ProductSize> repoProductSize,
            IRepositoryBase<ProductOption> repoProductOption,
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
        public override async Task<OperationResult> AddAsync(CartDto model)
        {

            var option = model.productOptionAdd;
            var check_item = _repo.FindAll(o => o.ProductId == model.ProductId 
            && o.StoreGuid == model.StoreGuid 
            && o.AccountUid == model.AccountUid
            && o.Status == 1
            && o.IsCheckout == 0
            && o.ProductSize == model.productSizeAdd
            && o.ProductOption.Equals(model.productOptionAdd)
            ).FirstOrDefault();
            if (check_item != null)
            {
                check_item.Quantity = check_item.Quantity + model.Quantity;
                //check_item.ProductSize = model.productSizeAdd;
                //check_item.ProductOption = model.productOptionAdd;
                _repo.Update(check_item);
            }
            else
            {
                var item = _mapper.Map<Cart>(model);
                item.Id = 0;
                item.ProductSize = model.productSizeAdd;
                item.ProductOption = model.productOptionAdd;
                item.Status = StatusConstants.Default;
                item.IsCheckout = StatusConstants.Default_2;
                _repo.Add(item);
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
                    await _logger.LogStoreProcedure(new LoggerParams {
                    Type= Line2uLogConst.Create,
                    LogText = $"Type: { ex.GetType().Name}, Message: { ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }
        public override async Task<CartDto> GetByIDAsync(object id)
        {
            var item = await _repo.FindByIDAsync(id);
            var author =  _repoXAccount.FindByID(item.CreateBy);
            var result = new CartDto()
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
        public override async Task<OperationResult> UpdateAsync(CartDto model)
        {
            var check = _repo.FindByID(model.Id);
            check.Quantity= model.Quantity;
            var item = _mapper.Map<Cart>(check);
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
        public override async Task<List<CartDto>> GetAllAsync()
        {
            var query = _repo.FindAll(x=> x.Status == StatusConstants.Default).ProjectTo<CartDto>(_configMapper);

            var data = await query.OrderByDescending(x=>x.Id).ToListAsync();
            return data;

        }

        public override async Task<OperationResult> DeleteAsync(object id)
        {
            var item = _repo.FindByID(id.ToDecimal());
            item.Status = StatusConstants.Delete3;
            item.Quantity = 0;
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

        public async Task<OperationResult> AddFormAsync(CartDto model)
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
                var item = _mapper.Map<Cart>(model);
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

    
        public async Task<OperationResult> UpdateFormAsync(CartDto model)
        {

            FileExtension fileExtension = new FileExtension();
           
            var item = _mapper.Map<Cart>(model);


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

        public async Task<object> GetTrackingOrderForStore(string storeGuid)
        {
            var result = _repoOrderDetail.FindAll(o => o.StoreGuid == storeGuid).DistinctBy(o => o.OrderGuid).ToList();
            var list_data = new List<Cart>();

            foreach (var item in result)
            {
                var item_add = await _repo.FindAll(o => o.Guid == item.OrderGuid).FirstOrDefaultAsync();
                list_data.Add(item_add);
            }

            return list_data;
        }


        public async Task<object> GetTrackingOrderUser(int accountId)
        {
            var order = await _repo.FindAll(o => o.AccountUid == accountId.ToString()).ToListAsync();
            var order_detail = await _repoOrderDetail.FindAll().ToListAsync();
            var products = await _repoProduct.FindAll().ToListAsync();
            var result = (from x in order
                          join y in order_detail on x.Guid equals y.OrderGuid
                          let z = products.Where(o => o.Guid == y.ProductGuid).ToList()
                          select new
                          {
                              orderID = x.Guid,
                              product_total_price = y.Quantity * y.Price,
                              list_product = z.Select(o => new {
                                o.ProductName,
                                o.PhotoPath,
                                price = y.Quantity * y.Price
                              })
                          }).ToList();


            return result;
        }

        public async Task<object> GetDetailOrder(string id)
        {
            var order = await _repo.FindAll(o => o.Guid == id).ToListAsync();
            var order_detail = await _repoOrderDetail.FindAll().ToListAsync();
            var products = await _repoProduct.FindAll().ToListAsync();
            var result = (from x in order
                          join y in order_detail on x.Guid equals y.OrderGuid
                          let z = products.Where(o => o.Guid == y.ProductGuid).ToList()
                          select new
                          {
                              orderID = x.Guid,
                              product_total_price = y.Quantity * y.Price,
                              list_product = z.Select(o => new {
                                  o.ProductName,
                                  o.PhotoPath,
                                  qty = y.Quantity,
                                  price = y.Quantity * y.Price
                              })
                          }).ToList();


            return result;
        }

        public async Task<object> GetProductsInCart(string accountGuid)
        {
            var temp_1 = await _repo.FindAll(x => x.AccountUid == accountGuid && x.IsCheckout == 0 && x.Status == 1).ToListAsync();
            var temp_2 = await _repoProduct.FindAll().ToListAsync();
            var product_size = _repoProductSize.FindAll();
            var product_option = _repoProductOption.FindAll();
            var result_tamp = (from x in temp_1
                         join y in temp_2 on x.ProductGuid equals y.Guid
                         select new
                         {
                             x.Id,
                             x.CreateDate,
                             x.CreateBy,
                             x.Quantity,
                             x.UpdateBy,
                             x.UpdateDate,
                             x.Status,
                             x.ProductId,
                             x.ProductGuid,
                             x.Guid,
                             x.AccountUid,
                             x.StoreGuid,
                             x.IsCheckout,
                             x.ProductPrice,
                             y.PhotoPath,
                             y.ProductName,
                             ProductPrices = y.ProductPrice,
                             ProductSize = product_size.Where(o => o.Id == x.ProductSize).FirstOrDefault() != null 
                             ? product_size.Where(o => o.Id == x.ProductSize).FirstOrDefault().Price.ToDouble() : 0,
                             ProductOption = string.IsNullOrEmpty(x.ProductOption) ? 0 : calculator(x.ProductOption),
                             //ProductOption = product_option.Where(o => o.Id == x.ProductOption).FirstOrDefault() != null
                             //? product_option.Where(o => o.Id == x.ProductOption).FirstOrDefault().Price.ToDouble() : 0,
                             y.ProductPriceDiscount,
                             ProductDescription = string.IsNullOrEmpty(y.ProductDescription) ? "" : y.ProductDescription,
                             ProductSizeAdd = x.ProductSize,
                             ProductOptionAdd = x.ProductOption,
                             ProductSizeTitle = string.IsNullOrEmpty(x.ProductSize.ToString()) ? "" : SizeTitle(x.ProductSize),
                             ProductOptionTitle = string.IsNullOrEmpty(x.ProductOption) ? "" : ToppingTitle(x.ProductOption),
                             

                         }).ToList();

            var result = result_tamp.Select(x => new
            {
                x.Id,
                x.CreateDate,
                x.CreateBy,
                x.Quantity,
                x.UpdateBy,
                x.UpdateDate,
                x.Status,
                x.ProductId,
                x.ProductGuid,
                x.Guid,
                x.AccountUid,
                x.StoreGuid,
                x.IsCheckout,
                x.ProductPrice,
                x.PhotoPath,
                x.ProductName,
                x.ProductPrices,
                x.ProductSize,
                x.ProductOption,
                x.ProductPriceDiscount,
                x.ProductDescription,
                x.ProductSizeAdd,
                x.ProductOptionAdd,
                x.ProductSizeTitle,
                x.ProductOptionTitle,
                ProductOfAllPrice = Math.Round((
                  (Convert.ToDouble(x.ProductPrice) * x.Quantity.ToDouble())
                + (Convert.ToDouble(x.ProductSize) * x.Quantity.ToDouble())
                + (Convert.ToDouble(x.ProductOption) * x.Quantity.ToDouble())
                ),2)
            }).ToList();
            return result;
        }
        private double calculator(string item)
        {
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

        private string ToppingTitle(string item)
        {
            var result_tamp = new List<string>();
            var items = item.Split(',');
            foreach (var item_plit in items)
            {
                var option = _repoProductOption.FindByID(item_plit.ToDecimal()).Topping;
                if (option != null)
                {
                   result_tamp.Add(option);
                }
            }
            return string.Join(',', result_tamp);
        }

        private string SizeTitle(decimal? item)
        {
            var size = _repoProductSize.FindByID(item.ToDecimal()).Size;
            return size;
        }
        public async Task<double> CartAmountTotal(string accountGuid)
        {
            var pro_size = _repoProductSize.FindAll().ToList();
            var pro_option = _repoProductOption.FindAll().ToList();
            var item_tamp = _repo.FindAll(x => 
            x.AccountUid == accountGuid 
            && x.IsCheckout == 0
            && x.Status == 1
            ).Select(x => new
            {
                x.ProductPrice,
                x.Quantity,
                x.ProductSize,
                x.ProductOption
                
            }).ToList();

            var item = item_tamp.Select(x => new
            {
                x.ProductPrice,
                x.Quantity,
                productSize = pro_size.Where(z => z.Id == x.ProductSize).FirstOrDefault() != null
                ? pro_size.Where(z => z.Id == x.ProductSize).FirstOrDefault().Price : "0",
                productOption = string.IsNullOrEmpty(x.ProductOption) ? 0 : calculator(x.ProductOption)
                //productOption = pro_option.Where(z => z.Id == x.ProductOption).FirstOrDefault() != null
                //? pro_option.Where(z => z.Id == x.ProductOption).FirstOrDefault().Price : "0",

            }).ToList();
            var resutl = item.Sum(o => (Convert.ToDouble(o.ProductPrice) + Convert.ToDouble(o.productSize) + Convert.ToDouble(o.productOption)) * o.Quantity);
            //var resutl = item.Sum(o => (Convert.ToDouble(o.ProductPrice) + Convert.ToDouble(o.productSize) ) * o.Quantity);
            return Math.Round(resutl.Value, 2);
        }
       
        public async Task<object> CartAmountTotal2(string accountGuid)
        {
            var item_tamp = _repo.FindAll(x => x.AccountUid == accountGuid && x.IsCheckout == 0).Select(o => new
            {
                total =  Convert.ToInt32(o.ProductPrice) * o.Quantity
            });
            //var item = item_tamp.Sum(x => x.total);
            return item_tamp;
        }

        public async Task<int> CartCountTotal(string accountGuid)
        {
            var item = await _repo.FindAll(x => x.AccountUid == accountGuid && x.IsCheckout == 0 && x.Status == 1 ).SumAsync(x => x.Quantity);
            return item ?? 0;
        }
    }
}
