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

namespace Line2u.Services
{
    public interface IOrderService : IServiceBase<Order, OrderDto>
    {
        Task<object> LoadData(DataManager data, string lang,string uid);
        Task<object> GetByGuid(string guid);
        Task<object> GetAudit(object id);
        Task<object> DeleteUploadFile(decimal key);
        Task<OperationResult> AddFormAsync(OrderDto model);
        Task<OperationResult> UpdateFormAsync(OrderDto model);

        Task<object> GetWebNews();
        Task<object> GetProducts(string id);
        Task<object> GetTrackingOrderForStore(string id);
        Task<object> GetTrackingOrderUser(int id);
        Task<object> GetDetailOrder(string id);
        Task<object> GetWebPages();
        
    }
    public class OrderService : ServiceBase<Order, OrderDto>, IOrderService, IScopeService
    {
        private readonly IRepositoryBase<Order> _repo;
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

        public OrderService(
            IRepositoryBase<Order> repo,
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
                        ProductGuid = item_products.Guid,
                        PendingStatus  = true,
                        AccountId = model.AccountId,
                        StoreGuid = model.StoreGuid,
                    };
                    list_order_detail.Add(item_add);
                }
                _repoOrderDetail.AddRange(list_order_detail);
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

        public async Task<object> GetTrackingOrderForStore(string storeGuid)
        {
            var result = await _repo.FindAll(o => o.StoreGuid == storeGuid).ToListAsync();
            return result;
        }


        public async Task<object> GetTrackingOrderUser(int accountId)
        {
            var order = await _repo.FindAll(o => o.AccountId == accountId.ToString()).ToListAsync();
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
    }
}
