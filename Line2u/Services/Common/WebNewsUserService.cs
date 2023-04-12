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

namespace Line2u.Services
{
    public interface IWebNewsUserService : IServiceBase<WebNewsUser, WebNewsUserDto>
    {
        Task<object> LoadData(DataManager data, string lang, int userID);
        Task<object> LoadDataAdmin(DataManager data, string lang, int userID, int storeId);
        Task<object> GetByGuid(string guid);
        Task<object> GetAudit(object id);
        Task<object> DeleteUploadFile(decimal key);
        Task<object> DeleteUploadFileThumbnail(decimal key);
        Task<OperationResult> AddFormAsync(WebNewsUserDto model);
        Task<OperationResult> UpdateFormAsync(WebNewsUserDto model);
        Task<object> GetByUserID(int userID);
        Task<object> GetWebNews();
        Task<object> GetWebPages();
        
    }
    public class WebNewsUserService : ServiceBase<WebNewsUser, WebNewsUserDto>, IWebNewsUserService, IScopeService
    {
        private readonly IRepositoryBase<WebNewsUser> _repo;
        private readonly IRepositoryBase<CodeType> _repoCodeType;
        private readonly IRepositoryBase<XAccount> _repoXAccount;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ISPService _spService;
        private readonly MapperConfiguration _configMapper;
private readonly ILine2uLoggerService _logger;
        private readonly IWebHostEnvironment _currentEnvironment;

        public WebNewsUserService(
            IRepositoryBase<WebNewsUser> repo,
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
        public async Task<object> LoadData(DataManager data, string lang, int userID)
        {
            var datasource = (from a in _repo.FindAll(x => x.CreateBy == userID)
                              join b in _repoCodeType.FindAll(x => x.CodeType1 == CodeTypeConst.WebNews_Type && x.Status == "Y") on a.Type equals b.CodeNo into ab
                              from t in ab.DefaultIfEmpty()

                              select new WebNewsDto
                              {
                                  Id = a.Id,
                                  Type = a.Type,
                                  SortId = a.SortId,
                                  Subject = a.Subject,
                                  PhotoPath = a.PhotoPath,
                                  Thumbnail = a.Thumbnail,
                                  StartDate = a.StartDate,
                                  EndDate = a.EndDate,
                                  Link = a.Link,
                                  Body = a.Body,
                                  Comment = a.Comment,
                                  NewsDate = a.NewsDate,
                                  CreateDate = a.CreateDate,
                                  CreateBy = a.CreateBy,
                                  UpdateDate = a.UpdateDate,
                                  UpdateBy = a.UpdateBy,
                                  CancelFlag = a.CancelFlag,
                                  Status = a.Status,
                                  Guid = a.Guid,
                                  TypeName = t == null ? "" : lang == Languages.EN ? t.CodeNameEn ?? t.CodeName : lang == Languages.VI ? t.CodeNameVn ?? t.CodeName : lang == Languages.CN ? t.CodeNameCn ?? t.CodeName : t.CodeName,
                              }).OrderByDescending(x => x.Id).AsQueryable();

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
        public override async Task<OperationResult> AddAsync(WebNewsUserDto model)
        {
            var item = _mapper.Map<WebNewsUser>(model);
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
        public override async Task<WebNewsUserDto> GetByIDAsync(object id)
        {
            var item = await _repo.FindByIDAsync(id);
            var author =  _repoXAccount.FindByID(item.CreateBy);
            var result = new WebNewsUserDto()
            {
                Id = item.Id,
                Body = item.Body,
                CancelFlag = item.CancelFlag,
                Comment = item.Comment,
                CreateBy = item.CreateBy,
                Author = author != null ? author.AccountName : "N/A",
                CreateDate = item.CreateDate,
                Guid = item.Guid,
                Link = item.Link,
                NewsDate = item.NewsDate,
                PhotoPath = item.PhotoPath,
                SortId = item.SortId,
                StartDate = item.StartDate,
                Status = item.Status,
                Subject = item.Subject,
                Type = item.Type,
                UpdateBy = item.UpdateBy,
                UpdateDate = item.UpdateDate,
            };
            return result;
        }
        public override async Task<OperationResult> UpdateAsync(WebNewsUserDto model)
        {
            var item = _mapper.Map<WebNewsUser>(model);
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
        public override async Task<List<WebNewsUserDto>> GetAllAsync()
        {
            var query = _repo.FindAll(x=> x.Status == StatusConstants.Default).ProjectTo<WebNewsUserDto>(_configMapper);

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

        public async Task<OperationResult> AddFormAsync(WebNewsUserDto model)
        {
          
            FileExtension fileExtension = new FileExtension();
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\webnews\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);

            //thumbnail
            var thumbnailFileName = string.Empty;
            var thumbnailFolderPath = "FileUploads\\images\\webnews\\thumbnail";
            string thumbnailFolder = Path.Combine(_currentEnvironment.WebRootPath, thumbnailFolderPath);
            if (model.File != null)
            {
                IFormFile files = model.File.FirstOrDefault();
                if (!files.IsNullOrEmpty())
                {
                    avatarUniqueFileName = await fileExtension.WriteAsync(files, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
                    model.PhotoPath = $"/FileUploads/images/webnews/avatar/{avatarUniqueFileName}";
                }
            }

            if (model.FileThumbnail != null)
            {
                IFormFile files = model.FileThumbnail.FirstOrDefault();
                if (!files.IsNullOrEmpty())
                {
                    thumbnailFileName = await fileExtension.WriteAsync(files, $"{thumbnailFolder}\\{thumbnailFileName}");
                    model.Thumbnail = $"/FileUploads/images/webnews/thumbnail/{thumbnailFileName}";
                }
            }
            try
            {
                var item = _mapper.Map<WebNewsUser>(model);
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

    
        public async Task<OperationResult> UpdateFormAsync(WebNewsUserDto model)
        {

            FileExtension fileExtension = new FileExtension();
           
            var item = _mapper.Map<WebNewsUser>(model);


            // Nếu có đổi ảnh thì xóa ảnh cũ và thêm ảnh mới
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\webnews\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);

            //thumbanail

            var thumbnailUniqueFileName = string.Empty;
            var thumbnailFolderPath = "FileUploads\\images\\webnews\\thumbnail";
            string thumbnailAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, thumbnailFolderPath);

            if (model.File != null)
            {
                IFormFile filesAvatar = model.File.FirstOrDefault();
                if (!filesAvatar.IsNullOrEmpty())
                {
                    if (!item.PhotoPath.IsNullOrEmpty())
                        fileExtension.Remove($"{_currentEnvironment.WebRootPath}{item.PhotoPath.Replace("/", "\\").Replace("/", "\\")}");
                    avatarUniqueFileName = await fileExtension.WriteAsync(filesAvatar, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
                    item.PhotoPath = $"/FileUploads/images/webnews/avatar/{avatarUniqueFileName}";
                }
            }
            if (model.FileThumbnail != null)
            {
                IFormFile filesAvatar_thumbnail = model.FileThumbnail.FirstOrDefault();
                if (!filesAvatar_thumbnail.IsNullOrEmpty())
                {
                    if (!item.Thumbnail.IsNullOrEmpty())
                        fileExtension.Remove($"{_currentEnvironment.WebRootPath}{item.Thumbnail.Replace("/", "\\").Replace("/", "\\")}");
                    thumbnailUniqueFileName = await fileExtension.WriteAsync(filesAvatar_thumbnail, $"{thumbnailAvatarFolder}\\{thumbnailUniqueFileName}");
                    item.Thumbnail = $"/FileUploads/images/webnews/thumbnail/{thumbnailUniqueFileName}";
                }
            }

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
                var item = await _repo.FindByIDAsync(key);
                if (item != null)
                {
                    string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, item.PhotoPath);
                    FileExtension fileExtension = new FileExtension();
                    var avatarUniqueFileName = item.PhotoPath;
                    if (!avatarUniqueFileName.IsNullOrEmpty())
                    {
                        var result = fileExtension.Remove($"{_currentEnvironment.WebRootPath}\\{item.PhotoPath}");
                        if (result)
                        {
                            item.PhotoPath = string.Empty;
                            _repo.Update(item);
                            await _unitOfWork.SaveChangeAsync();
                        }
                    }

                }


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

        public async Task<object> DeleteUploadFileThumbnail(decimal key)
        {
            try
            {
                var item = await _repo.FindByIDAsync(key);
                if (item != null)
                {
                    string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, item.Thumbnail);
                    FileExtension fileExtension = new FileExtension();
                    var avatarUniqueFileName = item.Thumbnail;
                    if (!avatarUniqueFileName.IsNullOrEmpty())
                    {
                        var result = fileExtension.Remove($"{_currentEnvironment.WebRootPath}\\{item.Thumbnail}");
                        if (result)
                        {
                            item.Thumbnail = string.Empty;
                            _repo.Update(item);
                            await _unitOfWork.SaveChangeAsync();
                        }
                    }

                }


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

        public async Task<object> GetByUserID(int userID)
        {
            return await _repo.FindAll(x => x.CreateBy == userID)
             .ToListAsync();
        }

        public async Task<object> LoadDataAdmin(DataManager data, string lang, int userID, int storeId)
        {
            var datasource = (from a in _repo.FindAll(x => x.CreateBy == userID && x.StoreId == storeId && x.Status == 1)
                              join b in _repoCodeType.FindAll(x => x.CodeType1 == CodeTypeConst.WebNews_Type && x.Status == "Y") on a.Type equals b.CodeNo into ab
                              from t in ab.DefaultIfEmpty()

                              select new WebNewsDto
                              {
                                  Id = a.Id,
                                  Type = a.Type,
                                  SortId = a.SortId,
                                  Subject = a.Subject,
                                  PhotoPath = a.PhotoPath,
                                  Thumbnail = a.Thumbnail,
                                  StartDate = a.StartDate,
                                  EndDate = a.EndDate,
                                  Link = a.Link,
                                  Body = a.Body,
                                  Comment = a.Comment,
                                  NewsDate = a.NewsDate,
                                  CreateDate = a.CreateDate,
                                  CreateBy = a.CreateBy,
                                  UpdateDate = a.UpdateDate,
                                  UpdateBy = a.UpdateBy,
                                  CancelFlag = a.CancelFlag,
                                  Status = a.Status,
                                  Guid = a.Guid,
                                  TypeName = t == null ? "" : lang == Languages.EN ? t.CodeNameEn ?? t.CodeName : lang == Languages.VI ? t.CodeNameVn ?? t.CodeName : lang == Languages.CN ? t.CodeNameCn ?? t.CodeName : t.CodeName,
                              }).OrderByDescending(x => x.Id).AsQueryable();

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
