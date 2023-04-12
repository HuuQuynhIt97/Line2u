using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
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
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Syncfusion.JavaScript;
using Syncfusion.JavaScript.DataSources;
using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Configuration;
using Dapper;
using isRock.LineBot;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;
using Syncfusion.JavaScript.Models;
using Syncfusion.JavaScript.DataVisualization.Models.Diagram;

namespace Line2u.Services
{
    public interface IStoreProfileService : IServiceBase<StoreProfile, StoreProfilesDto>
    {
        Task<OperationResult> AddFormAsync(StoreProfilesDto model);
        Task<OperationResult> AddFormAdmin(StoreProfilesDto model);
        Task<OperationResult> AddRatingComment(StoreRatingCommentDto model);
        Task<OperationResult> AddTable(StoreTableDto model);
        Task<OperationResult> UpdateStoreTable(StoreTableDto model);
        Task<OperationResult> UpdateFormAsync(StoreProfilesDto model);
        Task<OperationResult> UpdateFormMobileAsync(StoreProfilesDto model);
        Task<OperationResult> UpdateFormAdmin(StoreProfilesDto model);
        Task<object> DeleteUploadFile(decimal key);
        Task<object> GetByIDWithGuidAsync(string guid);
        Task<object> GetRatingAndComment(string guid);
        Task<object> GetAllStoreTable(int storeId);
        Task<bool> CheckRatingAndComment(string guid, int userId);
        Task<object> GetInforByStoreName(string name);
        Task<object> GetAll(int start);
        Task<object> GetMultiUserAccessStore(int accountId,int storeId);
        Task<object> GetAllAccountAccess();
        Task<object> GetAllCounty();
        Task<object> GetAllTowship();
        Task<object> GetTowshipByCounty(string CountyID);
        Task<object> GetAllStoreByCountyAndTownShip(string CountyID, string TownShipID, int star);

        Task<object> UploadAvatarForMobile(IFormFile file, decimal key);


    }
    public class StoreProfileService : ServiceBase<StoreProfile, StoreProfilesDto>, IStoreProfileService
    {
        private readonly IRepositoryBase<StoreProfile> _repo;
        private readonly IRepositoryBase<StoreTable> _repoStoreTable;
        private readonly IRepositoryBase<StoreProfileUser> _repoStoreProfileUser;
        private readonly IRepositoryBase<WebNewsUser> _repoWebNewsUser;
        private readonly IRepositoryBase<StoreRatingComment> _repoRatingComment;
        private readonly IRepositoryBase<County> _repoCounty;
        private readonly IRepositoryBase<Township> _repoTownship;
        private readonly IRepositoryBase<CodeType> _repoCodeType;
        private readonly IRepositoryBase<XAccount> _repoXAccount;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private readonly ILine2uLoggerService _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IWebHostEnvironment _currentEnvironment;
        private readonly IConfiguration _configuration;

        public StoreProfileService(
            IRepositoryBase<StoreProfile> repo,
            IRepositoryBase<StoreTable> repoStoreTable,
            IRepositoryBase<StoreProfileUser> repoStoreProfileUser,
            IRepositoryBase<Township> repoTownship,
            IRepositoryBase<County> repoCounty,
            IRepositoryBase<WebNewsUser> repoWebNewsUser,
            IRepositoryBase<CodeType> repoCodeType,
            IRepositoryBase<XAccount> repoXAccount,
            IRepositoryBase<StoreRatingComment> repoRatingComment,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            MapperConfiguration configMapper,
            ILine2uLoggerService logger,
            IHttpContextAccessor httpContextAccessor,
            IWebHostEnvironment currentEnvironment,
            IConfiguration configuration
    ,
            ISPService repoSp
            )
            : base(repo, logger, unitOfWork, mapper, configMapper)
        {
            _repo = repo;
            _repoStoreTable = repoStoreTable;
            _repoStoreProfileUser = repoStoreProfileUser;
            _repoTownship = repoTownship;
            _repoCounty = repoCounty;
            _repoWebNewsUser = repoWebNewsUser;
            _repoCodeType = repoCodeType;
            _repoXAccount = repoXAccount;
            _repoRatingComment = repoRatingComment;
            _logger = logger;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configMapper = configMapper;
            _httpContextAccessor = httpContextAccessor;
            _currentEnvironment = currentEnvironment;
            _configuration = configuration;
        }

        public async Task<object> UploadAvatarForMobile(IFormFile file, decimal key)
        {
            IFormFile filesAvatar = file;
            var Current = _httpContextAccessor.HttpContext;
            var url = $"{Current.Request.Scheme}://{Current.Request.Host}{Current.Request.PathBase}";
            var item = await _repo.FindAll(x => x.Id == key).FirstOrDefaultAsync();
            if (item == null)
            {
                return new OperationResult { StatusCode = HttpStatusCode.NotFound, Message = "Not Found!", Success = false };
            }

            FileExtension fileExtension = new FileExtension();

            // Nếu có đổi ảnh thì xóa ảnh cũ và thêm ảnh mới
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\product\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);

            if (filesAvatar != null)
            {
                if (!item.PhotoPath.IsNullOrEmpty())
                    fileExtension.Remove($"{_currentEnvironment.WebRootPath}{item.PhotoPath.Replace("/", "\\").Replace("/", "\\")}");
                avatarUniqueFileName = await fileExtension.WriteAsync(filesAvatar, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
                item.PhotoPath = $"/FileUploads/images/product/avatar/{avatarUniqueFileName}";
            }

            try
            {
                _repo.Update(item);
                await _unitOfWork.SaveChangeAsync();
                FileInfo info = new FileInfo($"{url}{item.PhotoPath}");
                return new
                {
                    initialPreview = $"<img src='{url}{item.PhotoPath}' class='file-preview-image' alt='img' title='img'>",
                    initialPreviewConfig = new List<dynamic> {
                    new
                    {
                        caption = "",
                        url= $"{url}/api/XAccount/DeleteUploadFile", // server delete action 
                        key= key
                    }
                },
                    append = true
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

                // Không thêm được thì xóa file vừa tạo đi
                return new List<dynamic>
                    {
                    new {
                        error = "No file found"

                        }
                    };
            }
        }
        public async Task<OperationResult> AddFormAsync(StoreProfilesDto model)
        {
            FileExtension fileExtension = new FileExtension();
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\store\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);
            //if (model.File != null)
            //{
            //    IFormFile files = model.File.FirstOrDefault();
            //    if (!files.IsNullOrEmpty())
            //    {
            //        avatarUniqueFileName = await fileExtension.WriteAsync(files, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
            //        model.PhotoPath = $"/FileUploads/images/store/avatar/{avatarUniqueFileName}";
            //    }
            //}
            List<string> galleries = new List<string>();
            if (model.File != null)
            {
                int id = 1;
                model.File.ForEach(async item =>
                {
                    string roomPhoto = await fileExtension.WriteAsync(item, $"{uploadAvatarFolder}\\{string.Empty}");
                    switch (id)
                    {
                        case 1:
                            model.PhotoPath = $"/FileUploads/images/store/avatar/{roomPhoto}";
                            break;
                        default:
                            break;
                    }
                    galleries.Add(roomPhoto);
                    id++;
                });
            }
            try
            {
                var item = _mapper.Map<StoreProfile>(model);
                item.Guid = Guid.NewGuid().ToString("N") + DateTime.Now.ToString("ssff");
                item.StoreOpenTime = model.StoreOpenTime;
                item.StoreCloseTime = model.StoreCloseTime;
                item.Status = 1;
                _repo.Add(item);
                await _unitOfWork.SaveChangeAsync();


                //// add account site
                //var account_store = new List<StoreProfileUser>();
                //if (model.MultiStores != null)
                //{
                //    foreach (var item_store in model.MultiStores)
                //    {
                //        var item_add = new StoreProfileUser
                //        {
                //            StoreId = item.Id,
                //            AccountId = item_store.ToDecimal()
                //        };
                //        account_store.Add(item_add);
                            
                //    };
                   
                //}
                // _repoStoreProfileUser.AddRange(account_store);
                //await _unitOfWork.SaveChangeAsync();
               
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

        public async Task<OperationResult> UpdateFormAsync(StoreProfilesDto model)
        {

            FileExtension fileExtension = new FileExtension();
            var itemModel = await _repo.FindAll(x => x.AccountGuid == model.Guid).AsNoTracking().FirstOrDefaultAsync();
            var item = _mapper.Map<StoreProfile>(itemModel);


            // Nếu có đổi ảnh thì xóa ảnh cũ và thêm ảnh mới
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\store\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);

            //if (model.File != null)
            //{
            //    IFormFile filesAvatar = model.File.FirstOrDefault();
            //    if (!filesAvatar.IsNullOrEmpty())
            //    {
            //        if (!item.PhotoPath.IsNullOrEmpty())
            //            fileExtension.Remove($"{_currentEnvironment.WebRootPath}{item.PhotoPath.Replace("/", "\\").Replace("/", "\\")}");
            //        avatarUniqueFileName = await fileExtension.WriteAsync(filesAvatar, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
            //        item.PhotoPath = $"/FileUploads/images/store/avatar/{avatarUniqueFileName}";
            //    }
            //}

            List<string> galleries = new List<string>();
            if (model.File != null)
            {
                if (!item.PhotoPath.IsNullOrEmpty())
                    fileExtension.Remove($"{_currentEnvironment.WebRootPath}{item.PhotoPath.Replace("/", "\\").Replace("/", "\\")}");

                item.PhotoPath = null;

                int id = 1;
                model.File.ForEach(async file =>
                {
                    string roomPhoto = await fileExtension.WriteAsync(file, $"{uploadAvatarFolder}\\{string.Empty}");
                    switch (id)
                    {
                        case 1:
                            item.PhotoPath = $"/FileUploads/images/room/image/{roomPhoto}";
                            break;
                        default:
                            break;
                    }
                    galleries.Add(roomPhoto);
                    id++;
                });
            }
            else
            {
                item.PhotoPath = string.Empty;
            }


            try
            {
                
                //item.LineID = model.LineID;
                //item.AccountNo = model.AccountNo;
                //item.AccountName = model.AccountName;
                //item.LineID = model.LineID;
                //item.LineName = model.LineName;
                //item.LinePicture = model.LinePicture;
                //item.IsLineAccount = model.IsLineAccount;
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

        
        private async Task LogStoreProcedure(decimal accountId, string logText)
        {
            using (SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                var Context = _httpContextAccessor.HttpContext;
                var url = string.Format("{0}://{1}{2}{3}", Context.Request.Scheme, Context.Request.Host, Context.Request.Path, Context.Request.QueryString);
                var remoteIpAddress = Context.Connection.RemoteIpAddress.ToString();
                string sql = "SP_Save_SYS_LOG";
                var parameters = new
                {
                    @LOG_Type = "",
                    @LOG_TEXT = logText,
                    @Account_ID = accountId,
                    @LOG_IP = remoteIpAddress,
                    @LOG_WIP = "",
                    @LOG_URL = url,
                };
                try
                {
                    await conn.QueryAsync(sql, parameters, commandType: CommandType.StoredProcedure);
                }
                catch
                {
                }

            }
        }

        public override async Task<StoreProfilesDto> GetByIDAsync(object id)
        {
            var item = await _repo.FindByIDAsync(id);
            var result_tamp = new StoreProfilesDto()
            {
                RatingCount = _repoRatingComment.FindAll(o => o.StoreGuid == item.Guid).ToList().Count(),
                RatingAVG = _repoRatingComment.FindAll(o => o.StoreGuid == item.Guid).ToList().Count() > 0 ?
                _repoRatingComment.FindAll(o => o.StoreGuid == item.Guid).ToList().Sum(y => int.Parse(y.Rating)) : 0
            };
            var result = new StoreProfilesDto()
            {
                Id = item.Id,
                AccountGuid = item.AccountGuid,
                Body = item.Body,
                Comment = item.Comment,
                CreateBy = item.CreateBy,
                CreateDate = item.CreateDate,
                Facebook = item.Facebook,
                Instagram = item.Instagram,
                Youtube = item.Youtube,
                Twitter = item.Twitter,
                Pinterest = item.Pinterest,
                PhotoPath = item.PhotoPath,
                StoreAddress = item.StoreAddress,
                StoreCloseTime = item.StoreCloseTime,
                StoreOpenTime = item.StoreOpenTime,
                StoreEmail = item.StoreEmail,
                StoreTel = item.StoreTel,
                StoreHightPrice = item.StoreHightPrice,
                StoreLowPrice = item.StoreLowPrice,
                StoreName = item.StoreName,
                Guid = item.Guid,
                Status = item.Status,
                UpdateBy = item.UpdateBy,
                UpdateDate = item.UpdateDate,
                CountyId = item.CountyId,
                TownShipId = item.TownShipId,
                RatingCount = result_tamp.RatingCount,
                RatingAVG = result_tamp.RatingCount > 0 ?  result_tamp.RatingAVG / result_tamp.RatingCount : 0
            };
            return result;
        }

        public async Task<object> GetAll(int start)
        {
            var store = await _repo.FindAll().ToListAsync();
            var datasource = (from item in store
                             let RatingCount = _repoRatingComment.FindAll(o => o.StoreGuid == item.Guid).ToList().Count()
                              let  RatingAVG = _repoRatingComment.FindAll(o => o.StoreGuid == item.Guid).ToList().Count() > 0 ?
                              _repoRatingComment.FindAll(o => o.StoreGuid == item.Guid).ToList().Sum(y => int.Parse(y.Rating)) : 0
                              let banner = _repoWebNewsUser.FindAll(o => o.StoreId == null ? o.CreateBy == item.CreateBy : o.CreateBy == item.CreateBy && o.StoreId == item.Id).ToList()
                              let create_name = _repoXAccount.FindAll(o => o.AccountId == item.CreateBy).FirstOrDefault()
                              select new StoreProfilesDto
                              {
                                  Id = item.Id,
                                  CountyId = item.CountyId,
                                  TownShipId = item.TownShipId,
                                  AccountGuid = item.AccountGuid,
                                  Body = item.Body,
                                  Comment = item.Comment,
                                  CreateBy = item.CreateBy,
                                  CreateDate = item.CreateDate,
                                  Facebook = item.Facebook,
                                  Instagram = item.Instagram,
                                  Youtube = item.Youtube,
                                  Twitter = item.Twitter,
                                  Pinterest = item.Pinterest,
                                  PhotoPath = item.PhotoPath,
                                  StoreAddress = item.StoreAddress,
                                  StoreCloseTime = item.StoreCloseTime,
                                  StoreOpenTime = item.StoreOpenTime,
                                  StoreEmail = item.StoreEmail,
                                  StoreTel = item.StoreTel,
                                  StoreHightPrice = item.StoreHightPrice,
                                  StoreLowPrice = item.StoreLowPrice,
                                  StoreName = item.StoreName,
                                  Guid = item.Guid,
                                  CreateName = create_name != null ? create_name.AccountName : "N/A",
                                  Status = item.Status,
                                  UpdateBy = item.UpdateBy,
                                  UpdateDate = item.UpdateDate,
                                  RatingCount = RatingCount,
                                  bannerList = banner,
                                  RatingAVG = RatingCount > 0 ? RatingAVG / RatingCount : 0
                              }).ToList();
            if (start > 0)
            {
                datasource = datasource.Where(x => x.RatingAVG == start).ToList();
            }
            {

            }
            return datasource;
        }
        public async Task<object> GetProfileMobile(string key)
        {
            var query = from x in _repo.FindAll(x => x.Status == 1 && x.Guid == key)
            select new
            {
                            AccountGuid = x.Guid,
                            x.PhotoPath,
                        };
            return await query.FirstOrDefaultAsync();
        }

        public async Task<OperationResult> UpdateFormMobileAsync(StoreProfilesDto model)
        {
            FileExtension fileExtension = new FileExtension();
            //var itemModel = await _repo.FindAll(x => x.Guid == model.Guid).AsNoTracking().FirstOrDefaultAsync();
            var item = _mapper.Map<StoreProfile>(model);
          

            // Nếu có đổi ảnh thì xóa ảnh cũ và thêm ảnh mới
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\store\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);

            if (model.File != null)
            {
                IFormFile filesAvatar = model.File.FirstOrDefault();
                if (!filesAvatar.IsNullOrEmpty())
                {
                    if (!item.PhotoPath.IsNullOrEmpty())
                        fileExtension.Remove($"{_currentEnvironment.WebRootPath}{item.PhotoPath.Replace("/", "\\").Replace("/", "\\")}");
                    avatarUniqueFileName = await fileExtension.WriteAsync(filesAvatar, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
                    item.PhotoPath = $"/FileUploads/images/store/avatar/{avatarUniqueFileName}";
                }
            }

            // xoa account site
            var item_del = _repoStoreProfileUser.FindAll(o => o.StoreId == model.Id).ToList();

            if (item_del.Count > 0)
            {
                _repoStoreProfileUser.RemoveMultiple(item_del);
                await _unitOfWork.SaveChangeAsync();
            }

            //// add account site
            //var account_store = new List<StoreProfileUser>();
            //if (model.MultiStores != null)
            //{
            //    foreach (var item_store in model.MultiStores)
            //    {
            //        var item_add = new StoreProfileUser
            //        {
            //            StoreId = item.Id,
            //            AccountId = item_store.ToDecimal()
            //        };
            //        account_store.Add(item_add);

            //    };
            //    //sau ddos add lai
            //    _repoStoreProfileUser.AddRange(account_store);
            //    await _unitOfWork.SaveChangeAsync();
            //}


            try
            {

                //item.StoreOpenTime = model.StoreOpenTime;
                //item.StoreName = model.StoreName;
                //item.StoreAddress = model.StoreAddress;
                //item.StoreCloseTime= model.StoreCloseTime;
                //item.StoreLowPrice = model.StoreLowPrice;
                //item.StoreHightPrice = model.StoreHightPrice;
                //item.Body = model.Body;
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

        public async Task<object> GetByIDWithGuidAsync(string guid)
        {
            return _repo.FindAll(o => o.AccountGuid == guid).FirstOrDefault();
        }

        

        public async Task<object> GetInforByStoreName(string name)
        {
            return _repo.FindAll(o => o.StoreName == name).FirstOrDefault();
        }

        public async Task<OperationResult> AddRatingComment(StoreRatingCommentDto model)
        {
            try
            {
                var item = _mapper.Map<StoreRatingComment>(model);
                item.Guid = Guid.NewGuid().ToString("N") + DateTime.Now.ToString("ssff");
                item.Status = 1;
                _repoRatingComment.Add(item);
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
                    Type = Line2uLogConst.Update,
                    LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);

                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

        public async Task<object> GetRatingAndComment(string guid)
        {
            var result_tamp = await _repoRatingComment.FindAll(x => x.StoreGuid == guid).Select(o => new
            {
                Comment = o.Comment,
                Comment_Date = o.CreateDate,
                Comment_Rating = o.Rating,
                o.CreateBy
            }).ToListAsync();
            var result = result_tamp.Select(x => new
            {
                x.Comment,
                x.Comment_Date,
                x.Comment_Rating,
                Comment_By = _repoXAccount.FindAll(o => o.AccountId == x.CreateBy).FirstOrDefault().AccountName,
                Comment_Picture = _repoXAccount.FindAll(o => o.AccountId == x.CreateBy).FirstOrDefault().LinePicture,
            }).ToList();

            return result;
        }

        public async Task<bool> CheckRatingAndComment(string guid, int userId)
        {
            try
            {
                var result = await _repoRatingComment.FindAll(x => x.StoreGuid == guid && x.CreateBy == userId).ToListAsync();
                var booled = result.Count > 0 ? true : false;

                return booled;
            }
            catch (Exception ex)
            {
                return false;
                throw;
            }
        }

        public async Task<object> GetAllCounty()
        {
            var result = await _repoCounty.FindAll().Select(x => new
            {
                x.CountyId,
                x.CountyName
            }).ToListAsync();

            return result;
        }

        public async Task<object> GetAllTowship()
        {
            var result = await _repoTownship.FindAll().Select(x => new
            {
                x.CountyId,
                x.TownshipId,
                x.TownshipName
            }).ToListAsync();

            return result;
        }

        public async Task<object> GetTowshipByCounty(string CountyID)
        {
            var result = await _repoTownship.FindAll(o => o.CountyId == CountyID).Select(x => new
            {
                x.CountyId,
                x.TownshipId,
                x.TownshipName
            }).ToListAsync();

            return result;
        }

        public async Task<object> GetAllStoreByCountyAndTownShip(string CountyID, string TownShipID, int star)
        {
            var store = new List<StoreProfile>();
            if (!string.IsNullOrEmpty(CountyID) && string.IsNullOrEmpty(TownShipID))
            {
                store = await _repo.FindAll(o => o.CountyId == CountyID).ToListAsync();
            }else if (!string.IsNullOrEmpty(CountyID) && !string.IsNullOrEmpty(TownShipID))
            {
                store = await _repo.FindAll(o => o.CountyId == CountyID && o.TownShipId == TownShipID).ToListAsync();
            }
            else
            {
                store = await _repo.FindAll().ToListAsync();
            }
            var datasource = (from item in store
                              let RatingCount = _repoRatingComment.FindAll(o => o.StoreGuid == item.Guid).ToList().Count()
                              let RatingAVG = _repoRatingComment.FindAll(o => o.StoreGuid == item.Guid).ToList().Count() > 0 ?
                              _repoRatingComment.FindAll(o => o.StoreGuid == item.Guid).ToList().Sum(y => int.Parse(y.Rating)) : 0
                              let banner = _repoWebNewsUser.FindAll(o => o.CreateBy == item.CreateBy).ToList()
                              let create_name = _repoXAccount.FindAll(o => o.AccountId == item.CreateBy).FirstOrDefault()
                              select new StoreProfilesDto
                              {
                                  Id = item.Id,
                                  AccountGuid = item.AccountGuid,
                                  Body = item.Body,
                                  Comment = item.Comment,
                                  CreateBy = item.CreateBy,
                                  CreateDate = item.CreateDate,
                                  Facebook = item.Facebook,
                                  Instagram = item.Instagram,
                                  Youtube = item.Youtube,
                                  Twitter = item.Twitter,
                                  Pinterest = item.Pinterest,
                                  PhotoPath = item.PhotoPath,
                                  StoreAddress = item.StoreAddress,
                                  StoreCloseTime = item.StoreCloseTime,
                                  StoreOpenTime = item.StoreOpenTime,
                                  StoreEmail = item.StoreEmail,
                                  StoreTel = item.StoreTel,
                                  StoreHightPrice = item.StoreHightPrice,
                                  StoreLowPrice = item.StoreLowPrice,
                                  StoreName = item.StoreName,
                                  Guid = item.Guid,
                                  CreateName = create_name != null ? create_name.AccountName : "N/A",
                                  Status = item.Status,
                                  UpdateBy = item.UpdateBy,
                                  UpdateDate = item.UpdateDate,
                                  RatingCount = RatingCount,
                                  bannerList = banner,
                                  RatingAVG = RatingCount > 0 ? RatingAVG / RatingCount : 0
                              }).ToList();
            if (star > 0)
            {
                datasource = datasource.Where(x => x.RatingAVG == star).ToList();
            }
            {

            }
            return datasource;
        }

        public async Task<object> GetAllAccountAccess()
        {
            var result = await _repoXAccount.FindAll(x => x.Status == "1" && string.IsNullOrEmpty(x.LineParentId)).ToListAsync();
            return result;
        }

        public async Task<object> GetMultiUserAccessStore(int accountId,int storeId)
        {
            var query = await _repoStoreProfileUser.FindAll(x => x.StoreId == storeId).Select(x => x.AccountId).ToListAsync();
            if (query.Count == 0)
            {
                query = _repo.FindAll(x => accountId == 1 ? x.Id == storeId && x.CreateBy == accountId : x.CreateBy == accountId).Select(x => x.CreateBy).ToList();
            }

            return query;
        }

        public async Task<OperationResult> AddFormAdmin(StoreProfilesDto model)
        {
            FileExtension fileExtension = new FileExtension();
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\store\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);
            //if (model.File != null)
            //{
            //    IFormFile files = model.File.FirstOrDefault();
            //    if (!files.IsNullOrEmpty())
            //    {
            //        avatarUniqueFileName = await fileExtension.WriteAsync(files, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
            //        model.PhotoPath = $"/FileUploads/images/store/avatar/{avatarUniqueFileName}";
            //    }
            //}
            List<string> galleries = new List<string>();
            if (model.File != null)
            {
                int id = 1;
                model.File.ForEach(async item =>
                {
                    string roomPhoto = await fileExtension.WriteAsync(item, $"{uploadAvatarFolder}\\{string.Empty}");
                    switch (id)
                    {
                        case 1:
                            model.PhotoPath = $"/FileUploads/images/store/avatar/{roomPhoto}";
                            break;
                        default:
                            break;
                    }
                    galleries.Add(roomPhoto);
                    id++;
                });
            }
            try
            {
                var item = _mapper.Map<StoreProfile>(model);
                item.Guid = Guid.NewGuid().ToString("N") + DateTime.Now.ToString("ssff");
                item.StoreOpenTime = model.StoreOpenTime;
                item.StoreCloseTime = model.StoreCloseTime;
                item.Status = 1;
                _repo.Add(item);
                await _unitOfWork.SaveChangeAsync();


                // add account site
                var account_store = new List<StoreProfileUser>();
                if (model.MultiStores != null)
                {
                    foreach (var item_store in model.MultiStores)
                    {
                        var item_add = new StoreProfileUser
                        {
                            StoreId = item.Id,
                            AccountId = item_store.ToDecimal()
                        };
                        account_store.Add(item_add);

                    };

                }
                _repoStoreProfileUser.AddRange(account_store);
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

        public async Task<OperationResult> UpdateFormAdmin(StoreProfilesDto model)
        {
            FileExtension fileExtension = new FileExtension();
            //var itemModel = await _repo.FindAll(x => x.Guid == model.Guid).AsNoTracking().FirstOrDefaultAsync();
            var item = _mapper.Map<StoreProfile>(model);


            // Nếu có đổi ảnh thì xóa ảnh cũ và thêm ảnh mới
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\store\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);

            if (model.File != null)
            {
                IFormFile filesAvatar = model.File.FirstOrDefault();
                if (!filesAvatar.IsNullOrEmpty())
                {
                    if (!item.PhotoPath.IsNullOrEmpty())
                        fileExtension.Remove($"{_currentEnvironment.WebRootPath}{item.PhotoPath.Replace("/", "\\").Replace("/", "\\")}");
                    avatarUniqueFileName = await fileExtension.WriteAsync(filesAvatar, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
                    item.PhotoPath = $"/FileUploads/images/store/avatar/{avatarUniqueFileName}";
                }
            }

            // xoa account site
            var item_del = _repoStoreProfileUser.FindAll(o => o.StoreId == model.Id).ToList();

            if (item_del.Count > 0)
            {
                _repoStoreProfileUser.RemoveMultiple(item_del);
                await _unitOfWork.SaveChangeAsync();
            }

            // add account site
            var account_store = new List<StoreProfileUser>();
            if (model.MultiStores != null)
            {
                foreach (var item_store in model.MultiStores)
                {
                    var item_add = new StoreProfileUser
                    {
                        StoreId = item.Id,
                        AccountId = item_store.ToDecimal()
                    };
                    account_store.Add(item_add);

                };
                //sau ddos add lai
                _repoStoreProfileUser.AddRange(account_store);
                await _unitOfWork.SaveChangeAsync();
            }


            try
            {

                //item.StoreOpenTime = model.StoreOpenTime;
                //item.StoreName = model.StoreName;
                //item.StoreAddress = model.StoreAddress;
                //item.StoreCloseTime= model.StoreCloseTime;
                //item.StoreLowPrice = model.StoreLowPrice;
                //item.StoreHightPrice = model.StoreHightPrice;
                //item.Body = model.Body;
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

        public async Task<OperationResult> AddTable(StoreTableDto model)
        {
            try
            {
                var item = _mapper.Map<StoreTable>(model);
                item.Guid = Guid.NewGuid().ToString("N") + DateTime.Now.ToString("ssff");
                _repoStoreTable.Add(item);
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
                    Type = Line2uLogConst.Update,
                    LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);

                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

        public async Task<OperationResult> UpdateStoreTable(StoreTableDto model)
        {
            try
            {
                var item = _mapper.Map<StoreTable>(model);
                _repoStoreTable.Update(item);
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
                    Type = Line2uLogConst.Update,
                    LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);

                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

        public async Task<object> GetAllStoreTable(int storeId)
        {
            var data = await _repoStoreTable.FindAll(x => x.StoreId == storeId).ToListAsync();
            return data;
        }
    }
}
