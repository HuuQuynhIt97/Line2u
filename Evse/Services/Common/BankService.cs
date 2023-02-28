using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using NetUtility;
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

namespace Evse.Services
{
    public interface IBankService : IServiceBase<Bank, BankDto>
    {
     
        Task<object> LoadData(DataManager data);
        Task<object> GetAudit(object id);
        Task<object> GetByGuid(string guid);
    }
    public class BankService : ServiceBase<Bank, BankDto>, IBankService, IScopeService
    {
        private readonly IRepositoryBase<Bank> _repo;
        private readonly IRepositoryBase<XAccount> _repoXAccount;
        private readonly IRepositoryBase<CodeType> _repoCodeType;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
private readonly IEvseLoggerService _logger;
        public BankService(
            IRepositoryBase<Bank> repo,
            IRepositoryBase<XAccount> repoXAccount,
            IRepositoryBase<CodeType> repoCodeType,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            MapperConfiguration configMapper,
IEvseLoggerService logger
            )
            : base(repo, logger, unitOfWork, mapper, configMapper)
        {
            _repo = repo;
_logger = logger;
            _repoXAccount = repoXAccount;
            _repoCodeType = repoCodeType;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configMapper = configMapper;
        }
        public async Task<object> LoadData(DataManager data)
        {
            var datasource =  _repo.FindAll(x => x.Status == StatusConstants.Default).OrderByDescending(x => x.Id).AsQueryable();
            if (data.Where != null) // for filtering
                datasource = QueryableDataOperations.PerformWhereFilter(datasource, data.Where, data.Where[0].Condition);
            if (data.Sorted != null)//for sorting
                datasource = QueryableDataOperations.PerformSorting(datasource, data.Sorted);
            if (data.Search != null)
                datasource = QueryableDataOperations.PerformSearching(datasource, data.Search);
           var count = await datasource.CountAsync();
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
        public async Task<object> GetByGuid(string guid)
        {
            return await _repo.FindAll(x => x.Guid == guid)
              .FirstOrDefaultAsync();
        }
        public override async Task<OperationResult> AddAsync(BankDto model)
        {
            var checkName = await CheckExistName(model.BankName);
            if (!checkName.Success) return checkName;
            var checkNo = await CheckExistNo(model.BankNo);
            if (!checkNo.Success) return checkNo;
            var item = _mapper.Map<Bank>(model);
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
                    Type= EvseLogConst.Create,
                    LogText = $"Type: { ex.GetType().Name}, Message: { ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }
        public async Task<OperationResult> CheckExistName(string bankName)
        {
            var item = await _repo.FindAll(x => x.BankName == bankName).AnyAsync();
            if (item)
            {
                return new OperationResult { StatusCode = HttpStatusCode.OK, Message = "The bank name already existed!", Success = false };
            }
            operationResult = new OperationResult
            {
                StatusCode = HttpStatusCode.OK,
                Success = true,
                Data = item
            };
            return operationResult;
        }

        public async Task<OperationResult> CheckExistNo(string bankNo)
        {
            var item = await _repo.FindAll(x => x.BankNo == bankNo).AnyAsync();
            if (item)
            {
                return new OperationResult { StatusCode = HttpStatusCode.OK, Message = "The bank NO already existed!", Success = false };
            }
            operationResult = new OperationResult
            {
                StatusCode = HttpStatusCode.OK,
                Success = true,
                Data = item
            };
            return operationResult;
        }
        public override async Task<OperationResult> UpdateAsync(BankDto model)
        {
            var itemModel = await _repo.FindAll(x => x.Id == model.Id).AsNoTracking().FirstOrDefaultAsync();
            if (itemModel.BankName != model.BankName)
            {
                var checkName = await CheckExistName(model.BankName);
                if (!checkName.Success) return checkName;
            }

            if (itemModel.BankNo != model.BankNo)
            {
                var checkNo = await CheckExistNo(model.BankNo);
                if (!checkNo.Success) return checkNo;
            }

            var item = _mapper.Map<Bank>(model);
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
                    Type= EvseLogConst.Update,
                    LogText = $"Type: { ex.GetType().Name}, Message: { ex.Message}, StackTrace: {ex.ToString()}"
                }).ConfigureAwait(false);
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }
        public override async Task<List<BankDto>> GetAllAsync()
        {
            var query = _repo.FindAll(x=> x.Status == StatusConstants.Default).ProjectTo<BankDto>(_configMapper);

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
                    Type= EvseLogConst.Delete,
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
    }
}
