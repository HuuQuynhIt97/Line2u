﻿using AutoMapper;
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

namespace Line2u.Services
{
    public interface IMainCategoryService : IServiceBase<MainCategory, MainCategoryDto>
    {
        Task<object> LoadData(DataManager data, string lang,string uid);
        Task<object> LoadDataAdmin(DataManager data, string lang,string uid, int storeId);
        Task<object> GetByGuid(string guid);
        Task<object> GetCategoryByUserID(string id);
        Task<object> GetCategoryByUserIDAndStore(string id, int storeId);
        Task<object> GetProducts(string id,string cusGuid, int storeId);
        Task<object> GetProductsOrderEdit(int id,int cusId, DateTime date,string orderId);
        Task<object> GetAudit(object id);
        Task<object> DeleteUploadFile(decimal key);
        Task<OperationResult> AddFormAsync(MainCategoryDto model);
        Task<OperationResult> UpdateFormAsync(MainCategoryDto model);

           Task<object> GetWebNews();
        Task<object> GetWebPages();
        
    }
    public class MainCategoryService : ServiceBase<MainCategory, MainCategoryDto>, IMainCategoryService, IScopeService
    {
        private readonly IRepositoryBase<MainCategory> _repo;
        private readonly IRepositoryBase<ProductSize> _repoProductSize;
        private readonly IRepositoryBase<ProductOption> _repoProductOption;
        private readonly IRepositoryBase<Cart> _repoCart;
        private readonly IRepositoryBase<OrderDetail> _repoOrderDetail;
        private readonly IRepositoryBase<StoreProfile> _repoStoreProfile;
        private readonly IRepositoryBase<Product> _repoProduct;
        private readonly IRepositoryBase<CodeType> _repoCodeType;
        private readonly IRepositoryBase<XAccount> _repoXAccount;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ISPService _spService;
        private readonly MapperConfiguration _configMapper;
private readonly ILine2uLoggerService _logger;
        private readonly IWebHostEnvironment _currentEnvironment;

        public MainCategoryService(
            IRepositoryBase<MainCategory> repo,
            IRepositoryBase<ProductSize> repoProductSize,
            IRepositoryBase<ProductOption> repoProductOption,
            IRepositoryBase<Cart> repoCart,
            IRepositoryBase<OrderDetail> repoOrderDetail,
            IRepositoryBase<StoreProfile> repoStoreProfile,
            IRepositoryBase<Product> repoProduct,
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
            _repoOrderDetail = repoOrderDetail;
            _repoCart = repoCart;
            _repoStoreProfile = repoStoreProfile;
            _repoProduct = repoProduct;
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
            return await _repo.FindAll(x => x.Guid == guid)
              .FirstOrDefaultAsync();
        }
        public async Task<object> LoadData(DataManager data, string lang, string uid)
        {
            var datasource =  _repo.FindAll(o => o.AccountUid == uid && o.Status == 1)
                              .OrderByDescending(x => x.Id).AsQueryable();

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
        public override async Task<OperationResult> AddAsync(MainCategoryDto model)
        {
            var item = _mapper.Map<MainCategory>(model);
            item.Status = StatusConstants.Default;
            _repo.Add(item);
            try
            {
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
        public override async Task<MainCategoryDto> GetByIDAsync(object id)
        {
            var item = await _repo.FindByIDAsync(id);
            var author =  _repoXAccount.FindByID(item.CreateBy);
            var result = new MainCategoryDto()
            {
                Id = item.Id,
                Body = item.Body,
               
                Comment = item.Comment,
                CreateBy = item.CreateBy,
                CreateDate = item.CreateDate,
                Guid = item.Guid,
                Status = item.Status,
                UpdateBy = item.UpdateBy,
                UpdateDate = item.UpdateDate,
            };
            return result;
        }
        public override async Task<OperationResult> UpdateAsync(MainCategoryDto model)
        {
            var item = _mapper.Map<MainCategory>(model);
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
        public override async Task<List<MainCategoryDto>> GetAllAsync()
        {
            var query = _repo.FindAll(x=> x.Status == StatusConstants.Default).ProjectTo<MainCategoryDto>(_configMapper);

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

        public async Task<OperationResult> AddFormAsync(MainCategoryDto model)
        {
          
            FileExtension fileExtension = new FileExtension();
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\webnews\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);
            //if (model.File != null)
            //{
            //    IFormFile files = model.File.FirstOrDefault();
            //    if (!files.IsNullOrEmpty())
            //    {
            //        avatarUniqueFileName = await fileExtension.WriteAsync(files, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
            //        model.PhotoPath = $"/FileUploads/images/webnews/avatar/{avatarUniqueFileName}";
            //    }
            //}
            try
            {
                var item = _mapper.Map<MainCategory>(model);
                item.Status = StatusConstants.Default;
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

    
        public async Task<OperationResult> UpdateFormAsync(MainCategoryDto model)
        {

            FileExtension fileExtension = new FileExtension();
           
            var item = _mapper.Map<MainCategory>(model);


            // Nếu có đổi ảnh thì xóa ảnh cũ và thêm ảnh mới
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\webnews\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);

            //if (model.File != null)
            //{
            //    IFormFile filesAvatar = model.File.FirstOrDefault();
            //    if (!filesAvatar.IsNullOrEmpty())
            //    {
            //        if (!item.PhotoPath.IsNullOrEmpty())
            //            fileExtension.Remove($"{_currentEnvironment.WebRootPath}{item.PhotoPath.Replace("/", "\\").Replace("/", "\\")}");
            //        avatarUniqueFileName = await fileExtension.WriteAsync(filesAvatar, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
            //        item.PhotoPath = $"/FileUploads/images/webnews/avatar/{avatarUniqueFileName}";
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

        public async Task<object> GetCategoryByUserID(string store_account_Guid)
        {
            return await _repo.FindAll(o => o.AccountUid == store_account_Guid).ToListAsync();
        }

        public async Task<object> GetProducts(string store_account_Guid,string cusGuid, int storeId)
        {
            var category = await _repo.FindAll(o => o.StoreId == storeId).ToListAsync();
            var storeGuid = _repoStoreProfile.FindAll(o => o.Id == storeId).FirstOrDefault().Guid;
            var products = await _repoProduct.FindAll().ToListAsync();
            var product_size = _repoProductSize.FindAll();
            var product_option = _repoProductOption.FindAll();
            var result = (from x in category
                         let y = products.Where(o => o.CategoryGuid == x.Guid).ToList()
                         select new
                         {
                             category = x.CategoryName,
                             list_product = y.Select(o => new
                             {
                                 o.Id,
                                 o.AccountUid,
                                 o.CategoryGuid,
                                 o.Body,
                                 o.CreateBy,
                                 o.Comment,
                                 o.CreateDate,
                                 o.Guid,
                                 o.PhotoPath,
                                 ProductDescription = string.IsNullOrEmpty(o.ProductDescription) ? "" : o.ProductDescription, 
                                 o.ProductName,
                                 o.ProductPrice,
                                 o.ProductPriceDiscount,
                                 o.Status,
                                 o.UpdateBy, 
                                 o.UpdateDate,

                                 totalOrder = _repoCart.FindAll(z => 
                                 z.ProductGuid == o.Guid 
                                 && z.AccountUid == cusGuid
                                 && z.Status  == 1
                                 && z.IsCheckout == 0).FirstOrDefault() != null ? _repoCart.FindAll(z =>
                                 z.ProductGuid == o.Guid
                                 && z.Status == 1
                                 && z.AccountUid == cusGuid
                                 && z.IsCheckout == 0).Sum(o => o.Quantity) : 0,

                                 storeGuid = storeGuid,

                                 cartCreateBy = _repoCart.FindAll(z =>
                                 z.ProductGuid == o.Guid
                                 && z.AccountUid == cusGuid
                                 && z.Status == 1
                                 && z.IsCheckout == 0).FirstOrDefault() != null ? _repoCart.FindAll(z =>
                                 z.ProductGuid == o.Guid
                                 && z.Status == 1
                                 && z.AccountUid == cusGuid
                                 && z.IsCheckout == 0).FirstOrDefault().CreateBy : 0,

                                 cartId = _repoCart.FindAll(z =>
                                 z.ProductGuid == o.Guid
                                 && z.AccountUid == cusGuid
                                 && z.Status == 1
                                 && z.IsCheckout == 0).FirstOrDefault() != null ? _repoCart.FindAll(z =>
                                 z.ProductGuid == o.Guid
                                 && z.Status == 1
                                 && z.AccountUid == cusGuid
                                 && z.IsCheckout == 0).FirstOrDefault().Id : 0,

                                 ProductSizeAdd = _repoCart.FindAll(z =>
                                 z.ProductGuid == o.Guid
                                 && z.AccountUid == cusGuid
                                 && z.Status == 1
                                 && z.IsCheckout == 0).FirstOrDefault() != null ? _repoCart.FindAll(z =>
                                 z.ProductGuid == o.Guid
                                 && z.Status == 1
                                 && z.AccountUid == cusGuid
                                 && z.IsCheckout == 0).FirstOrDefault().ProductSize : null,

                                 ProductOptionAdd = _repoCart.FindAll(z =>
                                 z.ProductGuid == o.Guid
                                 && z.AccountUid == cusGuid
                                 && z.Status == 1
                                 && z.IsCheckout == 0).FirstOrDefault() != null ? _repoCart.FindAll(z =>
                                 z.ProductGuid == o.Guid
                                 && z.Status == 1
                                 && z.AccountUid == cusGuid
                                 && z.IsCheckout == 0).FirstOrDefault().ProductOption : null,

                                 Quantity = _repoCart.FindAll(z =>
                                 z.ProductGuid == o.Guid
                                 && z.AccountUid == cusGuid
                                 && z.Status == 1
                                 && z.IsCheckout == 0).FirstOrDefault() != null ? _repoCart.FindAll(z =>
                                 z.ProductGuid == o.Guid
                                 && z.Status == 1
                                 && z.AccountUid == cusGuid
                                 && z.IsCheckout == 0).FirstOrDefault().Quantity : 1,

                                 ProductSize = product_size.Where(z => z.ProductId == o.Id).ToList(),
                                 ProductOption = product_option.Where(z => z.ProductId == o.Id).ToList()
                             }).ToList()
                         }).Where(o => o.list_product.Count > 0 ).ToList();
            return result;
        }

        public async Task<object> GetProductsOrderEdit(string store_account_Guid, string cusGuid)
        {
            var category = await _repo.FindAll(o => o.AccountUid == store_account_Guid).ToListAsync();
            var storeGuid = _repoStoreProfile.FindAll(o => o.AccountGuid == store_account_Guid).FirstOrDefault().Guid;
            var products = await _repoProduct.FindAll().ToListAsync();
            var result = (from x in category
                          let y = products.Where(o => o.CategoryGuid == x.Guid).ToList()
                          select new
                          {
                              category = x.CategoryName,
                              list_product = y.Select(o => new
                              {
                                  o.Id,
                                  o.AccountUid,
                                  o.CategoryGuid,
                                  o.Body,
                                  o.CreateBy,
                                  o.Comment,
                                  o.CreateDate,
                                  o.Guid,
                                  o.PhotoPath,
                                  ProductDescription = string.IsNullOrEmpty(o.ProductDescription) ? "" : o.ProductDescription,
                                  o.ProductName,
                                  o.ProductPrice,
                                  o.ProductPriceDiscount,
                                  o.Status,
                                  o.UpdateBy,
                                  o.UpdateDate,
                                  totalOrder = _repoCart.FindAll(z =>
                                  z.ProductGuid == o.Guid
                                  && z.AccountUid == cusGuid
                                  && z.Status == 1
                                  && z.IsCheckout == 0).FirstOrDefault() != null ? _repoCart.FindAll(z =>
                                  z.ProductGuid == o.Guid
                                  && z.Status == 1
                                  && z.AccountUid == cusGuid
                                  && z.IsCheckout == 0).FirstOrDefault().Quantity : 0,

                                  storeGuid = storeGuid,

                                  cartCreateBy = _repoCart.FindAll(z =>
                                  z.ProductGuid == o.Guid
                                  && z.AccountUid == cusGuid
                                  && z.Status == 1
                                  && z.IsCheckout == 0).FirstOrDefault() != null ? _repoCart.FindAll(z =>
                                  z.ProductGuid == o.Guid
                                  && z.Status == 1
                                  && z.AccountUid == cusGuid
                                  && z.IsCheckout == 0).FirstOrDefault().CreateBy : 0,

                                  cartId = _repoCart.FindAll(z =>
                                  z.ProductGuid == o.Guid
                                  && z.AccountUid == cusGuid
                                  && z.Status == 1
                                  && z.IsCheckout == 0).FirstOrDefault() != null ? _repoCart.FindAll(z =>
                                  z.ProductGuid == o.Guid
                                  && z.Status == 1
                                  && z.AccountUid == cusGuid
                                  && z.IsCheckout == 0).FirstOrDefault().Id : 0,
                              }).ToList()
                          }).Where(o => o.list_product.Count > 0).ToList();
            return result;
        }

        public async Task<object> GetProductsOrderEdit(int storeId, int cusId, DateTime date , string orderId)
        {
            var product_size = _repoProductSize.FindAll();
            var product_option = _repoProductOption.FindAll();
            var category = await _repo.FindAll(o => o.StoreId == storeId).ToListAsync();
            var storeGuid = _repoStoreProfile.FindByID(storeId.ToDecimal()).Guid;
            var products = await _repoProduct.FindAll().ToListAsync();
            var result = (from x in category
                          let y = products.Where(o => o.CategoryGuid == x.Guid).ToList()
                          select new
                          {
                              category = x.CategoryName,
                              list_product = y.Select(o => new
                              {
                                  o.Id,
                                  o.AccountUid,
                                  o.CategoryGuid,
                                  o.Body,
                                  o.CreateBy,
                                  o.Comment,
                                  o.CreateDate,
                                  o.Guid,
                                  o.PhotoPath,
                                  ProductDescription = string.IsNullOrEmpty(o.ProductDescription) ? "" : o.ProductDescription,
                                  o.ProductName,
                                  o.ProductPrice,
                                  o.ProductPriceDiscount,
                                  o.Status,
                                  o.UpdateBy,
                                  o.UpdateDate,

                                  totalOrder = _repoOrderDetail.FindAll(z =>
                                  z.ProductGuid == o.Guid
                                  && z.CreateBy == cusId
                                  && z.OrderGuid == orderId
                                  ).FirstOrDefault() != null 
                                  ? _repoOrderDetail.FindAll(z =>
                                  z.ProductGuid == o.Guid
                                  && z.OrderGuid == orderId
                                  && z.CreateBy == cusId
                                  ).FirstOrDefault().Quantity : 0,

                                  storeGuid = storeGuid,

                                  cartCreateBy = _repoOrderDetail.FindAll(z =>
                                  z.ProductGuid == o.Guid && z.OrderGuid == orderId
                                  && z.CreateBy == cusId
                                  ).FirstOrDefault() != null ? _repoOrderDetail.FindAll(z =>
                                  z.ProductGuid == o.Guid && z.OrderGuid == orderId
                                  && z.CreateBy == cusId
                                  ).FirstOrDefault().CreateBy : 0,

                                  ProductSizeAdd = _repoCart.FindAll(z =>
                                 z.ProductGuid == o.Guid
                                 && z.CreateBy == cusId
                                 && z.Status == 1
                                 && z.IsCheckout == 0).FirstOrDefault() != null ? _repoCart.FindAll(z =>
                                 z.ProductGuid == o.Guid
                                 && z.Status == 1
                                 && z.CreateBy == cusId
                                 && z.IsCheckout == 0).FirstOrDefault().ProductSize : null,

                                  ProductOptionAdd = _repoCart.FindAll(z =>
                                  z.ProductGuid == o.Guid
                                  && z.CreateBy == cusId
                                  && z.Status == 1
                                  && z.IsCheckout == 0).FirstOrDefault() != null ? _repoCart.FindAll(z =>
                                  z.ProductGuid == o.Guid
                                  && z.Status == 1
                                  && z.CreateBy == cusId
                                  && z.IsCheckout == 0).FirstOrDefault().ProductOption : null,

                                  Quantity = _repoCart.FindAll(z =>
                                  z.ProductGuid == o.Guid
                                  && z.CreateBy == cusId
                                  && z.Status == 1
                                  && z.IsCheckout == 0).FirstOrDefault() != null ? _repoCart.FindAll(z =>
                                  z.ProductGuid == o.Guid
                                  && z.Status == 1
                                  && z.CreateBy == cusId
                                  && z.IsCheckout == 0).FirstOrDefault().Quantity : 1,

                                  ProductSize = product_size.Where(z => z.ProductId == o.Id).ToList(),
                                  ProductOption = product_option.Where(z => z.ProductId == o.Id).ToList()


                              }).ToList()
                          }).Where(o => o.list_product.Count > 0).ToList();
            return result;
        }

        public async Task<object> GetCategoryByUserIDAndStore(string store_account_Guid, int storeId)
        {
            return await _repo.FindAll(o => o.StoreId == storeId && o.Status == 1).ToListAsync();
        }

        public async Task<object> LoadDataAdmin(DataManager data, string lang, string uid, int storeId)
        {
            var datasource = _repo.FindAll(o => o.AccountUid == uid && o.StoreId == storeId && o.Status == 1)
                              .OrderByDescending(x => x.Id).AsQueryable();

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
    }
}
