﻿using AutoMapper;
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

namespace Line2u.Services
{
    public interface IXAccountService : IServiceBase<XAccount, XAccountDto>
    {
        Task<OperationResult> LockAsync(decimal id);
        Task<XAccountDto> GetByUsername(string username);
        Task<object> GetXAccounts();
        Task<object> GetXAccountsToSendMessage();
        Task<object> GetRejectsByRequisition(string farmGuid);
        Task<object> GetRejectsByRepair(string farmGuid);
        Task<object> GetRejectsByAcceptance(string farmGuid);
        Task<object> GetRejectsBySalesOrder(string farmGuid);

        Task<object> GetRejectsByPigDisease(string farmGuid);
        Task<object> GetApproveByPigDisease(string farmGuid);
        Task<object> GetRecordByPigDisease(string farmGuid);
        Task<OperationResult> CheckPermission(string permissionName);


        Task<object> GetPermissionsDropdown(string accountGuid, string lang);
        Task<object> GetPermissions(string accountGuid, string lang);
        Task<OperationResult> StorePermission(StorePermissionDto request);

        Task<OperationResult> AddFormAsync(XAccountDto model);
        Task<OperationResult> UpdateFormAsync(XAccountDto model);
        Task<OperationResult> ChangePassword(XChangePasswordDto model);
        Task<object> DeleteUploadFile(decimal key);
        Task<object> UploadAvatar(decimal key);
        Task<object> ShowPassword(decimal key);
        Task<object> GetProfile(string key);
        Task<OperationResult> StoreProfile(StoreProfileDto request);

        Task<object> LoadData(DataManager data, string farmGuid, string lang);

        Task<object> GetXAccountsForDropdown(string farmGuid);
        Task<object> GetAudit(object id);
        Task<bool> UpdateTokenLine(string token, object id);
        Task<bool> RemoveTokenLine(object id);

         Task<object> UploadAvatarForMobile(IFormFile file, decimal key);

          Task<object> SP_Record_AccountCheck_Born(string recordGuid);
        Task<object> SP_Record_AccountCheck_Remove(string accountGuid);
        Task<object> SP_Record_AccountCheck_Confirm(string accountGuid);
        Task<object> SP_Record_AccountCheck_NeedCheck(string accountGuid);

        Task<OperationResult> CheckExistUsernameLine(string Uid);

    }
    public class XAccountService : ServiceBase<XAccount, XAccountDto>, IXAccountService
    {
        private readonly ISPService _repoSp;
        private readonly IRepositoryBase<XAccount> _repo;
        private readonly IRepositoryBase<CodeType> _repoCodeType;
        private readonly IRepositoryBase<XAccountPermission> _repoXAccountPermission;
        private readonly IRepositoryBase<XAccountGroupPermission> _repoXAccountGroupPermission;
        private readonly IRepositoryBase<CodePermission> _repoCodePermission;
        private readonly IRepositoryBase<Employee> _repoEmployee;
        private readonly IRepositoryBase<XAccountGroup> _repoXAccountGroup;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISequenceService _sequenceService;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private readonly ILine2uLoggerService _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IWebHostEnvironment _currentEnvironment;
        private readonly IConfiguration _configuration;

        public XAccountService(
            IRepositoryBase<XAccount> repo,
            IRepositoryBase<CodeType> repoCodeType,
            IRepositoryBase<XAccountPermission> repoXAccountPermission,
            IRepositoryBase<XAccountGroupPermission> repoXAccountGroupPermission,
            IRepositoryBase<CodePermission> repoCodePermission,
            IRepositoryBase<Employee> repoEmployee,
            IRepositoryBase<XAccountGroup> repoXAccountGroup,
            IUnitOfWork unitOfWork,
            ISequenceService sequenceService,
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
            _logger = logger;
            _repoCodeType = repoCodeType;
            _repoXAccountPermission = repoXAccountPermission;
            _repoXAccountGroupPermission = repoXAccountGroupPermission;
            _repoCodePermission = repoCodePermission;
            _repoEmployee = repoEmployee;
            _repoXAccountGroup = repoXAccountGroup;
            _unitOfWork = unitOfWork;
            _sequenceService = sequenceService;
            _mapper = mapper;
            _configMapper = configMapper;
            _httpContextAccessor = httpContextAccessor;
            _currentEnvironment = currentEnvironment;
            _configuration = configuration;
            _repoSp = repoSp;
        }

        public override async Task<object> GetDataDropdownlist(DataManager data)
        {
            var datasource = _repo.FindAll(x => x.Status == "1").Select(x => new
            {
                Id = x.AccountId,
                Guid = x.Guid,
                FarmGuid = x.FarmGuid,
                Name = x.AccountName ?? x.Uid,
                Status = x.Status
            }).AsQueryable();

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
            var itemNo = new List<dynamic>() {
                   new {
                    Guid = "",
                    Name = "No Item"
                }
                };
            return (await datasource.Select(x => new
            {
                Guid = x.Guid,
                Name = x.Name
            }).ToListAsync()).Union(itemNo).OrderBy(x => x.Guid);
        }

        public async Task<object> LoadData(DataManager data, string farmGuid, string lang)
        {
            var datasource = (from x in _repo.FindAll(x => x.Status == "1" || x.Status == "0")
                              join b in _repoXAccountGroup.FindAll() on x.AccountGroup equals b.Guid into gj
                              from a in gj.DefaultIfEmpty()
                           
                              join e in _repoEmployee.FindAll() on x.EmployeeGuid equals e.Guid into ef
                              from d in ef.DefaultIfEmpty()
                              join st in _repoCodeType.FindAll(x => x.Status == "Y" && x.CodeType1 == CodeTypeConst.Account_Status) on x.Status equals st.CodeNo into ass
                              from status in ass.DefaultIfEmpty()
                              select new XAccountDto
                              {
                                  AccountId = x.AccountId,
                                  ClinicId = x.ClinicId,
                                  Uid = x.Uid,
                                  Upwd = x.Upwd,
                                  AccountNo = x.AccountNo,
                                  AccountName = x.AccountName,
                                  AccountSex = x.AccountSex,
                                  AccountBirthday = x.AccountBirthday,
                                  AccountNickname = x.AccountNickname,
                                  AccountTel = x.AccountTel,
                                  AccountMobile = x.AccountMobile,
                                  AccountAddress = x.AccountAddress,
                                  AccountIdcard = x.AccountIdcard,
                                  AccountEmail = x.AccountEmail,
                                  StartDate = x.StartDate,
                                  EndDate = x.EndDate,
                                  Lastlogin = x.Lastlogin,
                                  Lastuse = x.Lastuse,
                                  Comment = x.Comment,
                                  Status = x.Status,
                                  Token = x.Token,
                                  CancelFlag = x.CancelFlag,
                                  CreateBy = x.CreateBy,
                                  CreateDate = x.CreateDate,
                                  UpdateBy = x.UpdateBy,
                                  UpdateDate = x.UpdateDate,
                                  PAdmin = x.PAdmin,
                                  PAccount = x.PAccount,
                                  PPatient = x.PPatient,
                                  PRequisitionConfirm = x.PRequisitionConfirm,
                                  PPhotoComment = x.PPhotoComment,
                                  LastLoginDate = x.LastLoginDate,
                                  PClinic = x.PClinic,
                                  PCodeType = x.PCodeType,
                                  PEnquiry = x.PEnquiry,
                                  PEnquiryResult = x.PEnquiryResult,
                                  Guid = x.Guid,
                                  RoleId = x.RoleId,
                                  TypeId = x.TypeId,
                                  FarmGuid = x.FarmGuid,
                                  EmployeeGuid = x.EmployeeGuid,
                                  EmployeeNickName = d.NickName ?? "N/A",
                                  AccountGroupName = a.GroupName ?? "N/A",
                                  AccountRole = x.AccountRole,
                                  AccountType = x.AccountType,
                                  AccountGroup = x.AccountGroup,
                                  AccountOrganization = x.AccountOrganization,
                                  AccountSite = x.AccountSite,
                                  ErrorLogin = x.ErrorLogin,
                                  PhotoPath = x.PhotoPath,
                                  AccountDomicileAddress = x.AccountDomicileAddress,
                                  AccessTokenLineNotify = x.AccessTokenLineNotify,
                                  StatusName = status == null ? "" : lang == Languages.EN ? status.CodeNameEn ?? status.CodeName : lang == Languages.VI ? status.CodeNameVn ?? status.CodeName : lang == Languages.CN ? status.CodeNameCn ?? status.CodeName : status.CodeName,
                              }).OrderByDescending(x => x.AccountId).AsNoTracking()
                .AsQueryable();
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
        public override async Task<List<XAccountDto>> GetAllAsync()
        {
            var query = from x in _repo.FindAll(x => (x.Status == "1" || x.Status == "0"))
                        join b in _repoXAccountGroup.FindAll() on x.AccountGroup equals b.Guid into gj
                        from a in gj.DefaultIfEmpty()
                      
                        join e in _repoEmployee.FindAll() on x.EmployeeGuid equals e.Guid into ef
                        from d in ef.DefaultIfEmpty()

                        select new XAccountDto
                        {
                            AccountId = x.AccountId,
                            ClinicId = x.ClinicId,
                            Uid = x.Uid,
                            Upwd = x.Upwd,
                            AccountNo = x.AccountNo,
                            AccountName = x.AccountName,
                            AccountSex = x.AccountSex,
                            AccountBirthday = x.AccountBirthday,
                            AccountNickname = x.AccountNickname,
                            AccountTel = x.AccountTel,
                            AccountMobile = x.AccountMobile,
                            AccountAddress = x.AccountAddress,
                            AccountIdcard = x.AccountIdcard,
                            AccountEmail = x.AccountEmail,
                            StartDate = x.StartDate,
                            EndDate = x.EndDate,
                            Lastlogin = x.Lastlogin,
                            Lastuse = x.Lastuse,
                            Comment = x.Comment,
                            Status = x.Status,
                            Token = x.Token,
                            CancelFlag = x.CancelFlag,
                            CreateBy = x.CreateBy,
                            CreateDate = x.CreateDate,
                            UpdateBy = x.UpdateBy,
                            UpdateDate = x.UpdateDate,
                            PAdmin = x.PAdmin,
                            PAccount = x.PAccount,
                            PPatient = x.PPatient,
                            PRequisitionConfirm = x.PRequisitionConfirm,
                            PPhotoComment = x.PPhotoComment,
                            LastLoginDate = x.LastLoginDate,
                            PClinic = x.PClinic,
                            PCodeType = x.PCodeType,
                            PEnquiry = x.PEnquiry,
                            PEnquiryResult = x.PEnquiryResult,
                            Guid = x.Guid,
                            RoleId = x.RoleId,
                            TypeId = x.TypeId,
                            FarmGuid = x.FarmGuid,
                            EmployeeGuid = x.EmployeeGuid,
                            EmployeeNickName = d.NickName ?? "N/A",
                            AccountGroupName = a.GroupName ?? "N/A",
                            AccountRole = x.AccountRole,
                            AccountType = x.AccountType,
                            AccountGroup = x.AccountGroup,
                            AccountOrganization = x.AccountOrganization,
                            AccountSite = x.AccountSite,
                            ErrorLogin = x.ErrorLogin,
                            PhotoPath = x.PhotoPath,
                            AccountDomicileAddress = x.AccountDomicileAddress,
                            AccessTokenLineNotify = x.AccessTokenLineNotify,
                        };

            var data = await query.OrderByDescending(x => x.AccountId).ToListAsync();
            return data;

        }
        public override async Task<OperationResult> DeleteAsync(object id)
        {
            string token = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            var accountId = JWTExtensions.GetDecodeTokenByID(token).ToDecimal();
            if (id.ToDecimal() == accountId)
            {
                return new OperationResult { StatusCode = HttpStatusCode.BadRequest, Message = "Can not delete your self", Success = false };
            }
            var item = _repo.FindByID(id);

            item.Status = "9";
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
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

        public async Task<OperationResult> LockAsync(decimal id)
        {
            var item = await _repo.FindByIDAsync(id);
            if (item == null)
            {
                return new OperationResult { StatusCode = HttpStatusCode.NotFound, Message = "Not found this account!", Success = false };
            }
            if (item.Status == "0")
            {
                return new OperationResult { StatusCode = HttpStatusCode.NotFound, Message = "This account is locked!", Success = false };
            }
            if (item.Status == "9")
            {
                return new OperationResult { StatusCode = HttpStatusCode.NotFound, Message = "This account doesn't exist!", Success = false };
            }
            try
            {
                _repo.Update(item);
                await _unitOfWork.SaveChangeAsync();
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.UnlockSuccess,
                    Success = true,
                    Data = item
                };
            }
            catch (Exception ex)
            {
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

        public async Task<XAccountDto> GetByUsername(string username)
        {
            var result = await _repo.FindAll(x => x.Uid.ToLower() == username.ToLower()).ProjectTo<XAccountDto>(_configMapper).FirstOrDefaultAsync();
            return result;
        }
        public async Task<OperationResult> CheckExistUsername(string userName)
        {
            var item = await _repo.FindAll(x => x.Uid == userName).AnyAsync();
            if (item)
            {
                return new OperationResult { StatusCode = HttpStatusCode.OK, Message = "The username already existed!", Success = false };
            }
            operationResult = new OperationResult
            {
                StatusCode = HttpStatusCode.OK,
                Success = true,
                Data = item
            };
            return operationResult;
        }

        public async Task<OperationResult> CheckExistNo(string accountNo)
        {
            var item = await _repo.FindAll(x => x.AccountNo == accountNo).AnyAsync();
            if (item)
            {
                return new OperationResult { StatusCode = HttpStatusCode.OK, Message = "The account NO already existed!", Success = false };
            }
            operationResult = new OperationResult
            {
                StatusCode = HttpStatusCode.OK,
                Success = true,
                Data = item
            };
            return operationResult;
        }

        public async Task<object> GetXAccounts()
        {
            var query = await _repo.FindAll(x => x.Status == "1")
                .Select(x => new
                {
                    x.Uid,
                    ID = x.AccountId
                }).ToListAsync();
            return query;
        }

        public async Task<object> UploadAvatar(decimal key)
        {
            IFormFile filesAvatar = _httpContextAccessor.HttpContext.Request.Form.Files.FirstOrDefault();
            var Current = _httpContextAccessor.HttpContext;
            var url = $"{Current.Request.Scheme}://{Current.Request.Host}{Current.Request.PathBase}";
            var item = await _repo.FindAll(x => x.AccountId == key).FirstOrDefaultAsync();
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

        public async Task<object> UploadAvatarForMobile(IFormFile file, decimal key)
        {
            IFormFile filesAvatar = file;
            var Current = _httpContextAccessor.HttpContext;
            var url = $"{Current.Request.Scheme}://{Current.Request.Host}{Current.Request.PathBase}";
            var item = await _repo.FindAll(x => x.AccountId == key).FirstOrDefaultAsync();
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
        public async Task<OperationResult> AddFormAsync(XAccountDto model)
        {
            if (model.IsLineAccount != "1")
            {
                var check = await CheckExistUsername(model.Uid);
                if (!check.Success) return check;
                var checkAccountNo = await CheckExistNo(model.AccountNo);
                if (!checkAccountNo.Success) return checkAccountNo;
            }
            FileExtension fileExtension = new FileExtension();
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\account\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);
            if (model.File != null)
            {
                IFormFile files = model.File.FirstOrDefault();
                if (!files.IsNullOrEmpty())
                {
                    avatarUniqueFileName = await fileExtension.WriteAsync(files, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
                    model.PhotoPath = $"/FileUploads/images/account/avatar/{avatarUniqueFileName}";
                }
            }
            try
            {
                var item = _mapper.Map<XAccount>(model);
                item.Upwd = model.Upwd.ToSha512();
                //item.Guid = Guid.NewGuid().ToString("N") + DateTime.Now.ToString("ssff");
                //item.Upwd = item.Upwd.ToEncrypt();
                //item.Status = "1";
                item.Status = "1";
                item.LocalLogin = "1";
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

        public async Task<OperationResult> UpdateFormAsync(XAccountDto model)
        {

            FileExtension fileExtension = new FileExtension();
            var itemModel = await _repo.FindAll(x => x.AccountId == model.AccountId).AsNoTracking().FirstOrDefaultAsync();
            if (model.IsLineAccount != "1")
            {

                if (itemModel.Uid != model.Uid)
                {
                    var check = await CheckExistUsername(model.Uid);
                    if (!check.Success) return check;
                }

                if (itemModel.AccountNo != model.AccountNo)
                {
                    var checkAccountNo = await CheckExistNo(model.AccountNo);
                    if (!checkAccountNo.Success) return checkAccountNo;
                }
            }else
            {
                itemModel = await _repo.FindAll(x => x.Uid == model.Uid).FirstOrDefaultAsync();
            }
            var item = _mapper.Map<XAccount>(itemModel);
            if (model.IsLineAccount != "1")
            {
                if (itemModel.Upwd != model.Upwd)
                {
                    item.Upwd = model.Upwd.ToSha512();
                }
            }

            // Nếu có đổi ảnh thì xóa ảnh cũ và thêm ảnh mới
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\account\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);

            if (model.File != null)
            {
                IFormFile filesAvatar = model.File.FirstOrDefault();
                if (!filesAvatar.IsNullOrEmpty())
                {
                    if (!item.PhotoPath.IsNullOrEmpty())
                        fileExtension.Remove($"{_currentEnvironment.WebRootPath}{item.PhotoPath.Replace("/", "\\").Replace("/", "\\")}");
                    avatarUniqueFileName = await fileExtension.WriteAsync(filesAvatar, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
                    item.PhotoPath = $"/FileUploads/images/account/avatar/{avatarUniqueFileName}";
                }
            }

            try
            {
                
                item.LineID = model.LineID;
                item.AccountNo = model.AccountNo;
                item.AccountName = model.AccountName;
                item.LineID = model.LineID;
                item.LineName = model.LineName;
                item.LinePicture = model.LinePicture;
                item.IsLineAccount = model.IsLineAccount;
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

        public async Task<object> ShowPassword(decimal key)
        {
            var item = await _repo.FindByIDAsync(key);
            if (item != null)
            {
                return new
                {
                    UpwdDecrypt = item.Upwd.ToDecrypt(),
                    UpwdEncrypt = item.Upwd,
                };
            }
            return new
            {
                UpwdDecrypt = "",
                UpwdEncrypt = "",
            };
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
        public async Task<OperationResult> ChangePassword(XChangePasswordDto model)
        {
            var item = await _repo.FindByIDAsync(model.ID);
            if (item == null)
            {
                return new OperationResult { StatusCode = HttpStatusCode.OK, Message = "Account not found!", Success = false };
            }
            if (!item.Upwd.VerifyHashedPassword(model.OldPassword.ToSha512()))
            {
                return new OperationResult { StatusCode = HttpStatusCode.OK, Message = "The old password does not match!", Success = false };
            }
            try
            {
                item.Upwd = model.Upwd.ToSha512();
                _repo.Update(item);
                await _unitOfWork.SaveChangeAsync();
                LogStoreProcedure(item.AccountId, "ChangePassword").ConfigureAwait(false).GetAwaiter();

                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.ChangePasswordSuccess,
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

        public async Task<object> GetProfile(string key)
        {
            var query = from x in _repo.FindAll(x => x.Status == "1" && x.Guid == key)
                        join b in _repoEmployee.FindAll(x => x.Status == 1) on x.EmployeeGuid equals b.Guid into gj
                        from emp in gj.DefaultIfEmpty()

                        join e in _repoCodeType.FindAll(x => CodeTypeConst.PageSize_Setting == x.CodeType1 && x.Status == "Y") on x.PageSizeSetting equals e.CodeNo into ef
                        from d in ef.DefaultIfEmpty()
                        select new
                        {
                            x.AccountId,
                            AccountGuid = x.Guid,
                            x.PhotoPath,
                            emp.NickName,
                            emp.Mobile,
                            emp.Email,
                            emp.ContactName,
                            emp.ContactTel,
                            emp.Address,
                            emp.AddressDomicile,
                            EnableLineNotify = string.IsNullOrEmpty(x.AccessTokenLineNotify),
                            PageSizeSetting = x.PageSizeSetting,
                            PageSizeSettingValue = d != null ? d.CodeName : ""
                        };
            return await query.FirstOrDefaultAsync();
        }
        public async Task<object> GetPermissions(string accountGuid, string lang)
        {
            var query = from a in _repoXAccountPermission.FindAll(x => x.UpperGuid == accountGuid).AsNoTracking()
                        select new
                        {
                            a.CodeNo
                        };
            var accountGroup = await _repo.FindAll(x => x.Guid == accountGuid).AsNoTracking().FirstOrDefaultAsync();
            if (string.IsNullOrEmpty(accountGroup.AccountGroup) == false)
            {
                var query2 = from a in _repoXAccountGroupPermission.FindAll(x => x.UpperGuid == accountGroup.AccountGroup).AsNoTracking()
                             select new
                             {
                                 a.CodeNo
                             };
                var data1 = await query.Select(x => x.CodeNo).ToListAsync();
                var data2 = await query2.Select(x => x.CodeNo).ToListAsync();
                return data1.Union(data2).Distinct();
            }
            return await query.Select(x => x.CodeNo).Distinct().ToListAsync();
        }
        public async Task<object> GetPermissionsDropdown(string accountGuid, string lang)
        {
            var query = from a in _repoCodePermission.FindAll(x => x.Status == "1").OrderBy(x => x.Sort).AsNoTracking()
                        join b in _repoXAccountPermission.FindAll(x => x.UpperGuid == accountGuid).AsNoTracking() on a.CodeNo equals b.CodeNo into gj
                        from x in gj.DefaultIfEmpty()
                        where x.UpperGuid == null || x.UpperGuid != accountGuid

                        select new
                        {
                            a.Id,
                            a.CodeNo,
                            Code = x.CodeNo,
                            x.UpperGuid,
                            Name = lang == Languages.EN ? (a.CodeNameEn == "" ? a.CodeName : a.CodeNameEn) : lang == Languages.VI ? (a.CodeNameVn == "" ? a.CodeName : a.CodeNameVn) : lang == Languages.TW ? a.CodeName : lang == Languages.CN ? (a.CodeNameCn == "" ? a.CodeName : a.CodeNameCn) : a.CodeName,

                        };
            if (!string.IsNullOrEmpty(accountGuid))
            {
                var query2 = from a in _repoCodePermission.FindAll(x => x.Status == "1").AsNoTracking()
                             join b in _repoXAccountPermission.FindAll().AsNoTracking() on a.CodeNo equals b.CodeNo
                             where b.UpperGuid == accountGuid
                             select new
                             {
                                 a.Id,
                                 a.CodeNo,
                                 Code = b.CodeNo,
                                 b.UpperGuid,
                                 Name = lang == Languages.EN ? (a.CodeNameEn == "" ? a.CodeName : a.CodeNameEn) : lang == Languages.VI ? (a.CodeNameVn == "" ? a.CodeName : a.CodeNameVn) : lang == Languages.TW ? a.CodeName : lang == Languages.CN ? (a.CodeNameCn == "" ? a.CodeName : a.CodeNameCn) : a.CodeName,
                             };
                var data = await query.ToListAsync();
                var data2 = await query2.ToListAsync();
                return data.Union(data2).ToList().DistinctBy(x => x.Id);

            }
            return (await query.ToListAsync()).DistinctBy(x => x.Id);
        }

        public async Task<OperationResult> StorePermission(StorePermissionDto request)
        {
            try
            {
                var ap = await _repoXAccountPermission.FindAll(x => x.UpperGuid == request.Guid).ToListAsync();
                var permissions = await _repoCodePermission.FindAll(x => request.Permissions.Contains(x.CodeNo)).Select(x => x.CodeNo).ToListAsync();

                if (ap.Any())
                {
                    _repoXAccountPermission.RemoveMultiple(ap);
                    var xapList = new List<XAccountPermission>();
                    foreach (var item in permissions)
                    {
                        xapList.Add(new XAccountPermission
                        {
                            CodeNo = item,
                            UpperGuid = request.Guid,
                        });
                    }
                    _repoXAccountPermission.AddRange(xapList);
                }
                else
                {
                    var xapList = new List<XAccountPermission>();
                    foreach (var item in permissions)
                    {
                        xapList.Add(new XAccountPermission
                        {
                            CodeNo = item,
                            UpperGuid = request.Guid
                        });
                    }
                    _repoXAccountPermission.AddRange(xapList);
                }

                await _unitOfWork.SaveChangeAsync();
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.AddSuccess,
                    Success = true,
                    Data = request.Permissions
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
        public async Task<OperationResult> StoreProfile(StoreProfileDto request)
        {
            try
            {
                var query = await (from x in _repo.FindAll(x => x.Status == "1" && x.Guid == request.AccountGuid)
                                   join b in _repoEmployee.FindAll() on x.EmployeeGuid equals b.Guid into gj
                                   from emp in gj.DefaultIfEmpty()
                                   select new
                                   {
                                       emp,
                                       x
                                   }).FirstOrDefaultAsync();
                var employee = query.emp;
                employee.NickName = request.NickName;
                employee.Mobile = request.Mobile;
                employee.Email = request.Email;
                employee.ContactName = request.ContactName;
                employee.ContactTel = request.ContactTel;
                employee.Address = request.Address;
                employee.AddressDomicile = request.AddressDomicile;
                _repoEmployee.Update(employee);

                var account = query.x;
                account.PageSizeSetting = request.PageSizeSetting;
                _repo.Update(account);

                await _unitOfWork.SaveChangeAsync();

                var pageSizeSetting = await _repoCodeType.FindAll(x => x.CodeNo == request.PageSizeSetting && CodeTypeConst.PageSize_Setting == x.CodeType1 && x.Status == "Y").AsNoTracking().Select(x => x.CodeName).FirstOrDefaultAsync();
                if (pageSizeSetting != null)
                {
                    request.PageSizeSettingValue = pageSizeSetting;
                    request.PageSizeSetting = account.PageSizeSetting;
                }
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.AddSuccess,
                    Success = true,
                    Data = request
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

        public async Task<object> GetRejectsByRequisition(string farmGuid)
        {
            var query = await _repo.FindAll(x => x.FarmGuid == farmGuid && (x.Status == "1" || x.Status == "0"))
                .Select(x => new
                {
                    x.Guid,
                    Name = x.Uid
                }).ToListAsync();
            return query;
        }

        public async Task<object> GetRejectsByRepair(string farmGuid)
        {
            var query = await _repo.FindAll(x => x.FarmGuid == farmGuid && (x.Status == "1" || x.Status == "0"))
                .Select(x => new
                {
                    x.Guid,
                    Name = x.Uid
                }).ToListAsync();
            return query;
        }
        public async Task<object> GetRejectsBySalesOrder(string farmGuid)
        {
            var query = await _repo.FindAll(x => x.FarmGuid == farmGuid && (x.Status == "1" || x.Status == "0"))
                .Select(x => new
                {
                    x.Guid,
                    Name = x.Uid
                }).ToListAsync();
            return query;
        }
        public async Task<object> GetRejectsByAcceptance(string farmGuid)
        {
            var query = await _repo.FindAll(x => x.FarmGuid == farmGuid && (x.Status == "1" || x.Status == "0"))
                .Select(x => new
                {
                    x.Guid,
                    Name = x.Uid
                }).ToListAsync();
            return query;
        }
        public async Task<object> GetRejectsByPigDisease(string farmGuid)
        {
            var query = await _repo.FindAll(x => x.FarmGuid == farmGuid && (x.Status == "1" || x.Status == "0"))
                .Select(x => new
                {
                    x.Guid,
                    Name = x.Uid
                }).ToListAsync();
            return query;
        }


        public async Task<object> GetApproveByPigDisease(string farmGuid)
        {
            var query = await _repo.FindAll(x => x.FarmGuid == farmGuid && (x.Status == "1" || x.Status == "0"))
                .Select(x => new
                {
                    x.Guid,
                    Name = x.Uid
                }).ToListAsync();
            return query;
        }
        public async Task<object> GetRecordByPigDisease(string farmGuid)
        {
            var query = await _repo.FindAll(x => x.FarmGuid == farmGuid && (x.Status == "1" || x.Status == "0"))
                .Select(x => new
                {
                    x.Guid,
                    Name = x.Uid
                }).ToListAsync();
            return query;
        }

        public async Task<object> GetXAccountsForDropdown(string farmGuid)
        {
            var query = await _repo.FindAll(x => x.FarmGuid == farmGuid && (x.Status == "1" || x.Status == "0"))
                .Select(x => new
                {
                    x.Guid,
                    Name = x.Uid
                }).ToListAsync();
            return query;
        }
        public async Task<object> GetAudit(object id)
        {
            var data = await _repo.FindAll(x => x.AccountId.Equals(id)).AsNoTracking().Select(x => new { x.UpdateBy, x.CreateBy, x.UpdateDate, x.CreateDate }).FirstOrDefaultAsync();
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
                var updateAudit = await _repo.FindAll(x => x.AccountId == data.UpdateBy).AsNoTracking().Select(x => new { x.Uid }).FirstOrDefaultAsync();
                updateBy = updateBy != null ? updateAudit.Uid : "N/A";
                updateDate = data.UpdateDate.HasValue ? data.UpdateDate.Value.ToString("yyyy/MM/dd HH:mm:ss") : "N/A";
            }
            if (data.CreateBy.HasValue)
            {
                var createAudit = await _repo.FindAll(x => x.AccountId == data.CreateBy).AsNoTracking().Select(x => new { x.Uid }).FirstOrDefaultAsync();
                createBy = createAudit != null ? createAudit.Uid : "N/A";
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
        public async Task<bool> UpdateTokenLine(string token, object id)
        {

            try
            {
                var item = await _repo.FindByIDAsync(id);
                item.AccessTokenLineNotify = token;
                await _unitOfWork.SaveChangeAsync();
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }
        public async Task<bool> RemoveTokenLine(object id)
        {
            var item = await _repo.FindByIDAsync(id);
            item.AccessTokenLineNotify = null;
            try
            {
                await _unitOfWork.SaveChangeAsync();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public Task<OperationResult> CheckPermission(string permissionName)
        {
            throw new NotImplementedException();
        }


        public async Task<object> SP_Record_AccountCheck_Born(string recordGuid) => await _repoSp.SP_Record_AccountCheck_Born(recordGuid);
        public async Task<object> SP_Record_AccountCheck_Remove(string accountGuid) => await _repoSp.SP_Record_AccountCheck_Remove(accountGuid);
        public async Task<object> SP_Record_AccountCheck_Confirm(string accountGuid) => await _repoSp.SP_Record_AccountCheck_Confirm(accountGuid);
        public async Task<object> SP_Record_AccountCheck_NeedCheck(string accountGuid) => await _repoSp.SP_Record_AccountCheck_NeedCheck(accountGuid);

        public async Task<OperationResult> CheckExistUsernameLine(string Uid)
        {
            var item = _repo.FindAll(x => x.Uid == Uid).Any();
            if (item)
            {
                return new OperationResult { StatusCode = HttpStatusCode.OK, Message = "The username already existed!", Success = true };
            }
            operationResult = new OperationResult
            {
                StatusCode = HttpStatusCode.OK,
                Success = false,
                Data = item
            };
            return operationResult;
        }

        public async Task<object> GetXAccountsToSendMessage()
        {
            var list_Account = await _repo.FindAll(x => x.Status == "1" && x.IsLineAccount == "1").ToListAsync();
            //var list_AccountGroup = await _repoXAccountGroup.FindAll(x => x.Status == 1).ToListAsync();

            var query = (
                        from x in list_Account
                        select new
                        {
                            x.AccountName,
                            x.Guid,
                            x.Uid
                        }).ToList();

            return query;
        }
    }
}
