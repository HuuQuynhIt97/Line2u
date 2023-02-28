using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Evse.Constants;
using Evse.Data;
using Evse.DTO;
using Evse.Helpers;
using Evse.Models;
using Evse.Services.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Syncfusion.JavaScript;
using Syncfusion.JavaScript.DataSources;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using NetUtility;
using System.IO;

namespace Evse.Services
{
    public interface IMemberService : IServiceBase<Member, MemberDto>
    {
        Task<object> LoadData(DataManager data, string lang);
        Task<object> GetByGuid(string guid);
        Task<object> GetAudit(object id);
        Task<object> DeleteUploadFile(decimal key);
        Task<OperationResult> AddFormAsync(MemberDto model);
        Task<OperationResult> UpdateFormAsync(MemberDto model);
    }
    public class MemberService : ServiceBase<Member, MemberDto>, IMemberService, IScopeService
    {
        private readonly IRepositoryBase<Member> _repo;
        private readonly IRepositoryBase<CodeType> _repoCodeType;
        private readonly IRepositoryBase<XAccount> _repoXAccount;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private readonly IEvseLoggerService _logger;
        private readonly IWebHostEnvironment _currentEnvironment;
        public MemberService(
            IRepositoryBase<Member> repo,
            IRepositoryBase<CodeType> repoCodeType,
            IRepositoryBase<XAccount> repoXAccount,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            MapperConfiguration configMapper,
IEvseLoggerService logger
,
IWebHostEnvironment currentEnvironment)
            : base(repo, logger, unitOfWork, mapper, configMapper)
        {
            _repo = repo;
            _logger = logger;
            _repoCodeType = repoCodeType;
            _repoXAccount = repoXAccount;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configMapper = configMapper;
            _currentEnvironment = currentEnvironment;
        }
        public async Task<object> GetByGuid(string guid)
        {
            return await _repo.FindAll(x => x.Guid == guid)
              .FirstOrDefaultAsync();
        }
        public async Task<object> LoadData(DataManager data, string lang)
        {
            var datasource = (from a in _repo.FindAll(x => x.Status == StatusConstants.Default)
                              join b in _repoCodeType.FindAll(x => x.CodeType1 == CodeTypeConst.Member_SEX && x.Status == "Y") on a.MemberSex equals b.CodeNo into ab
                              from t in ab.DefaultIfEmpty()
                            
                              select new MemberDto
                              {
                                  Id = a.Id,
                                  SiteGuid = a.SiteGuid,
                                  Uid = a.Uid,
                                  Upwd = a.Upwd,
                                  MemberNo = a.MemberNo,
                                  MemberName = a.MemberName,
                                  MemberSex = a.MemberSex,
                                  MemberBirthday = a.MemberBirthday,
                                  MemberIdcard = a.MemberIdcard,
                                  MemberEmail = a.MemberEmail,
                                  MemberMobile = a.MemberMobile,
                                
                                  MemberAddress = a.MemberAddress,

                                  MemberLine = a.MemberLine,
                                  CarGuid = a.CarGuid,
                                  PaymentGuid = a.PaymentGuid,


                                  PhotoPath = a.PhotoPath,
                                  StartDate = a.StartDate,
                                  EndDate = a.EndDate,
                                  Lastlogin = a.Lastlogin,
                                  Lastuse = a.Lastuse,


                                  Comment = a.Comment,
                                  CreateDate = a.CreateDate,
                                  CreateBy = a.CreateBy,
                                  UpdateDate = a.UpdateDate,
                                  UpdateBy = a.UpdateBy,
                                  DeleteDate = a.DeleteDate,
                                  DeleteBy = a.DeleteBy,
                                  Status = a.Status,
                                  Guid = a.Guid,
                                  MemberSexName = t == null ? "" : lang == Languages.EN ? t.CodeNameEn ?? t.CodeName : lang == Languages.VI ? t.CodeNameVn ?? t.CodeName : lang == Languages.CN ? t.CodeNameCn ?? t.CodeName : t.CodeName,
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

        public override async Task<List<MemberDto>> GetAllAsync()
        {
            var query = _repo.FindAll(x => x.Status == 1).ProjectTo<MemberDto>(_configMapper);

            var data = await query.ToListAsync();
            return data;

        }
        public override async Task<OperationResult> AddAsync(MemberDto model)
        {
            var item = _mapper.Map<Member>(model);
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
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

        public override async Task<OperationResult> DeleteAsync(object id)
        {
            var item = await _repo.FindByIDAsync(id);
            item.Status = StatusConstants.Delete;
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
        public async Task<object> GetAudit(object id)
        {
            var data = await _repo.FindAll(x => x.Id.Equals(id)).AsNoTracking().Select(x => new { x.UpdateBy, x.CreateBy, x.UpdateDate, x.CreateDate }).FirstOrDefaultAsync();
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
                var updateAudit = await _repoXAccount.FindAll(x => x.AccountId == data.UpdateBy).AsNoTracking().Select(x => new { x.Uid }).FirstOrDefaultAsync();
                updateBy = updateBy != null ? updateAudit.Uid : "N/A";
                updateDate = data.UpdateDate.HasValue ? data.UpdateDate.Value.ToString("yyyy/MM/dd HH:mm:ss") : "N/A";
            }
            if (data.CreateBy.HasValue)
            {
                var createAudit = await _repoXAccount.FindAll(x => x.AccountId == data.CreateBy).AsNoTracking().Select(x => new { x.Uid }).FirstOrDefaultAsync();
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

        public async Task<OperationResult> AddFormAsync(MemberDto model)
        {
            var check = await CheckExistName(model.MemberName);
            if (!check.Success) return check;
            var checkMemberNo = await CheckExistNo(model.MemberNo);
            if (!checkMemberNo.Success) return checkMemberNo;
            FileExtension fileExtension = new FileExtension();
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\member\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);
            if (model.File != null)
            {
                IFormFile files = model.File.FirstOrDefault();
                if (!files.IsNullOrEmpty())
                {
                    avatarUniqueFileName = await fileExtension.WriteAsync(files, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
                    model.PhotoPath = $"/FileUploads/images/member/avatar/{avatarUniqueFileName}";
                }
            }
            try
            {
                var item = _mapper.Map<Member>(model);
                item.Upwd = model.Upwd.ToSha512();
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
                    Type = EvseLogConst.Create,
                    LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                if (!avatarUniqueFileName.IsNullOrEmpty())
                    fileExtension.Remove($"{uploadAvatarFolder}\\{avatarUniqueFileName}");

                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

        public async Task<OperationResult> CheckExistName(string memberName)
        {
            var item = await _repo.FindAll(x => x.MemberName == memberName).AnyAsync();
            if (item)
            {
                return new OperationResult { StatusCode = HttpStatusCode.OK, Message = "The member name already existed!", Success = false };
            }
            operationResult = new OperationResult
            {
                StatusCode = HttpStatusCode.OK,
                Success = true,
                Data = item
            };
            return operationResult;
        }

        public async Task<OperationResult> CheckExistNo(string memberNo)
        {
            var item = await _repo.FindAll(x => x.MemberNo == memberNo).AnyAsync();
            if (item)
            {
                return new OperationResult { StatusCode = HttpStatusCode.OK, Message = "The member NO already existed!", Success = false };
            }
            operationResult = new OperationResult
            {
                StatusCode = HttpStatusCode.OK,
                Success = true,
                Data = item
            };
            return operationResult;
        }
        public async Task<OperationResult> UpdateFormAsync(MemberDto model)
        {

            FileExtension fileExtension = new FileExtension();
            var itemModel = await _repo.FindAll(x => x.Id == model.Id).AsNoTracking().FirstOrDefaultAsync();
            if (itemModel.MemberName != model.MemberName)
            {
                var check = await CheckExistName(model.MemberName);
                if (!check.Success) return check;
            }

            if (itemModel.MemberNo != model.MemberNo)
            {
                var checkMemberNo = await CheckExistNo(model.MemberNo);
                if (!checkMemberNo.Success) return checkMemberNo;
            }
              if (itemModel.Upwd != model.Upwd)
            {
                itemModel.Upwd = model.Upwd.ToSha512();
            }
            var item = _mapper.Map<Member>(model);


            // Nếu có đổi ảnh thì xóa ảnh cũ và thêm ảnh mới
            var avatarUniqueFileName = string.Empty;
            var avatarFolderPath = "FileUploads\\images\\member\\avatar";
            string uploadAvatarFolder = Path.Combine(_currentEnvironment.WebRootPath, avatarFolderPath);

            if (model.File != null)
            {
                IFormFile filesAvatar = model.File.FirstOrDefault();
                if (!filesAvatar.IsNullOrEmpty())
                {
                    if (!item.PhotoPath.IsNullOrEmpty())
                        fileExtension.Remove($"{_currentEnvironment.WebRootPath}{item.PhotoPath.Replace("/", "\\").Replace("/", "\\")}");
                    avatarUniqueFileName = await fileExtension.WriteAsync(filesAvatar, $"{uploadAvatarFolder}\\{avatarUniqueFileName}");
                    item.PhotoPath = $"/FileUploads/images/member/avatar/{avatarUniqueFileName}";
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
                    Type = EvseLogConst.Update,
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
    await _logger.LogStoreProcedure(new LoggerParams {
                    Type= EvseLogConst.Delete,
                    LogText = $"Type: { ex.GetType().Name}, Message: { ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                return new { status = true };
            }
        }


    }
}
