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
    public interface IDeviceService : IServiceBase<Device, DeviceDto>
    {
        Task<object> LoadData(DataManager data, string lang);
        Task<object> GetByGuid(string guid);
        Task<object> GetAudit(object id);
        Task<object> GetLandlordDevice(DataManager data, string lang,string landLordGuid);
   
    }
    public class DeviceService : ServiceBase<Device, DeviceDto>, IDeviceService, IScopeService
    {
        private readonly IRepositoryBase<Device> _repo;
        private readonly IRepositoryBase<Site> _repoSite;
        private readonly IRepositoryBase<CodeType> _repoCodeType;
        private readonly IRepositoryBase<XAccount> _repoXAccount;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private readonly IEvseLoggerService _logger;
        private readonly IWebHostEnvironment _currentEnvironment;
        public DeviceService(
            IRepositoryBase<Device> repo,
            IRepositoryBase<CodeType> repoCodeType,
            IRepositoryBase<XAccount> repoXAccount,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            MapperConfiguration configMapper,
IEvseLoggerService logger
,
IWebHostEnvironment currentEnvironment,
IRepositoryBase<Site> repoSite)
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
            _repoSite = repoSite;
        }
        public override async Task<object> GetDataDropdownlist(DataManager data)
        {
            var datasource = (from a in _repo.FindAll(x => x.Status == 1)
                              select new
                              {

                                  Id = a.Id,
                                  Guid = a.Guid,
                                  DeviceNo= a.DeviceNo,
                                  DeviceName = a.DeviceName,
                                  Name = $"{a.DeviceNo} - {a.DeviceName}",
                                  Status = a.Status,

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
            return await datasource.ToListAsync();
        }

        public async Task<object> GetByGuid(string guid)
        {
            return await _repo.FindAll(x => x.Guid == guid)
              .FirstOrDefaultAsync();
        }
        public async Task<object> LoadData(DataManager data, string lang)
        {
            var datasource = (from a in _repo.FindAll(x => x.Status == StatusConstants.Default)
                              join b in _repoCodeType.FindAll(x => x.CodeType1 == CodeTypeConst.Lot_Type && x.Status == "Y") on a.DeviceType equals b.CodeNo into ab
                              from t in ab.DefaultIfEmpty()
                            
                              select new DeviceDto
                              {
                                  Id = a.Id,
                                  ParkingLotGuid = a.ParkingLotGuid,
                                  SiteGuid = a.SiteGuid,
                                  DeviceType = a.DeviceType,
                                  DeviceNo = a.DeviceNo,
                                  DeviceName = a.DeviceName,
                                  DeviceLeftNo = a.DeviceLeftNo,
                                  DeviceLeftGuid = a.DeviceLeftGuid,
                                  DeviceRightGuid = a.DeviceRightGuid,
                                  DeviceRightNo = a.DeviceRightNo,
                                

                                  Comment = a.Comment,
                                  CreateDate = a.CreateDate,
                                  CreateBy = a.CreateBy,
                                  UpdateDate = a.UpdateDate,
                                  UpdateBy = a.UpdateBy,
                                  DeleteDate = a.DeleteDate,
                                  DeleteBy = a.DeleteBy,
                                  Status = a.Status,
                                  Guid = a.Guid,
                                  DeviceTypeName = t == null ? "" : lang == Languages.EN ? t.CodeNameEn ?? t.CodeName : lang == Languages.VI ? t.CodeNameVn ?? t.CodeName : lang == Languages.CN ? t.CodeNameCn ?? t.CodeName : t.CodeName,
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

        public override async Task<List<DeviceDto>> GetAllAsync()
        {
            var query = _repo.FindAll(x => x.Status == 1).ProjectTo<DeviceDto>(_configMapper);

            var data = await query.ToListAsync();
            return data;

        }
        public override async Task<OperationResult> AddAsync(DeviceDto model)
        {
              var check = await CheckExistName(model.DeviceName);
            if (!check.Success) return check;
            var checkDeviceNo = await CheckExistNo(model.DeviceNo);
            if (!checkDeviceNo.Success) return checkDeviceNo;
            var item = _mapper.Map<Device>(model);
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

      
        public async Task<OperationResult> CheckExistName(string siteName)
        {
            var item = await _repo.FindAll(x => x.DeviceName == siteName).AnyAsync();
            if (item)
            {
                return new OperationResult { StatusCode = HttpStatusCode.OK, Message = "The site name already existed!", Success = false };
            }
            operationResult = new OperationResult
            {
                StatusCode = HttpStatusCode.OK,
                Success = true,
                Data = item
            };
            return operationResult;
        }

        public async Task<OperationResult> CheckExistNo(string siteNo)
        {
            var item = await _repo.FindAll(x => x.DeviceNo == siteNo).AnyAsync();
            if (item)
            {
                return new OperationResult { StatusCode = HttpStatusCode.OK, Message = "The site NO already existed!", Success = false };
            }
            operationResult = new OperationResult
            {
                StatusCode = HttpStatusCode.OK,
                Success = true,
                Data = item
            };
            return operationResult;
        }

        public async Task<object> GetLandlordDevice(DataManager data, string lang,string landLordGuid)
        {
            var datasource  = from a in _repo.FindAll()
                        join b in _repoSite.FindAll(x=> x.LandlordGuid == landLordGuid) on a.SiteGuid equals b.Guid
                       join c in _repoCodeType.FindAll(x => x.CodeType1 == CodeTypeConst.Lot_Type && x.Status == "Y") on a.DeviceType equals c.CodeNo into ac
                              from t in ac.DefaultIfEmpty()
                            
                        select new {
                             Id = a.Id,
                                  ParkingLotGuid = a.ParkingLotGuid,
                                  SiteGuid = a.SiteGuid,
                                  DeviceType = a.DeviceType,
                                  DeviceNo = a.DeviceNo,
                                  DeviceName = a.DeviceName,
                                  DeviceLeftNo = a.DeviceLeftNo,
                                  DeviceLeftGuid = a.DeviceLeftGuid,
                                  DeviceRightGuid = a.DeviceRightGuid,
                                  DeviceRightNo = a.DeviceRightNo,
                                

                                  Comment = a.Comment,
                                  CreateDate = a.CreateDate,
                                  CreateBy = a.CreateBy,
                                  UpdateDate = a.UpdateDate,
                                  UpdateBy = a.UpdateBy,
                                  DeleteDate = a.DeleteDate,
                                  DeleteBy = a.DeleteBy,
                                  Status = a.Status,
                                  Guid = a.Guid,
                        };

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
