using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NetUtility;
using Evse.Constants;
using Evse.Data;
using Evse.DTO;
using Evse.Helpers;
using Evse.Models;
using Evse.Services.Base;
using Syncfusion.JavaScript;
using Syncfusion.JavaScript.DataSources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Evse.Services
{
    public interface ISysMenuService : IServiceBase<SysMenu, SysMenuDto>
    {
        Task<object> LoadData(DataManager dm);
        Task<object> LoadData(DataManager dm, decimal upperId);
        Task<object> LoadReportMenuData(DataManager dm, string reportType);
        Task<object> LoadReportChartConfigMenuData(DataManager dm, string reportType);
        Task<object> GetMenus(string lang);
        Task<object> GetMenusByMenuType(string lang, string menuType);
        Task<object> GetMenusByFarm(string farmGuid, string lang);
        Task<object> GetParents(string lang);
        Task<object> GetToolbarParents(string lang);
        Task<object> GetItemByKind(string lang, string kind);
        Task<string> GetStoredProceduresName(string guid);
        Task<object> GetAudit(object id);
        Task<object> GetToolbarParentsLevel2(string lang, int upperId);

    }
    public class SysMenuService : ServiceBase<SysMenu, SysMenuDto>, ISysMenuService
    {
        private readonly IRepositoryBase<SysMenu> _repo;
        private readonly IRepositoryBase<XAccount> _repoXAccount;
        private readonly IRepositoryBase<XAccountGroup> _repoXAccountGroup;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private readonly IEvseLoggerService _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SysMenuService(
            IRepositoryBase<SysMenu> repo,
            IRepositoryBase<XAccount> repoXAccount,
            IRepositoryBase<XAccountGroup> repoXAccountGroup,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            MapperConfiguration configMapper,
IEvseLoggerService logger

            )
            : base(repo, logger, unitOfWork, mapper, configMapper)
        {
            _repo = repo;
            _logger = logger;
            _repoXAccountGroup = repoXAccountGroup;
            _repoXAccount = repoXAccount;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configMapper = configMapper;
            _httpContextAccessor = httpContextAccessor;
        }
        public override async Task<OperationResult> AddAsync(SysMenuDto model)
        {
            try
            {
                var item = _mapper.Map<SysMenu>(model);
                item.Status = 1;
                item.FarmGgp = 1;
                item.FarmGp = 1;
                item.FarmPmpf = 1;
                item.FarmGrower = 1;
                item.FarmNursery = 1;
                item.FarmSemen = 1;
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
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

        public override async Task<OperationResult> UpdateAsync(SysMenuDto model)
        {
            try
            {
                var item = await _repo.FindByIDAsync(model.Id);
                item.Type = model.Type;
                item.MenuName = model.MenuName;
                item.MenuNameEn = model.MenuNameEn;
                item.MenuNameVn = model.MenuNameVn;
                item.MenuNameCn = model.MenuNameCn;
                item.MenuIcon = model.MenuIcon;
                item.Comment = model.Comment;
                item.MenuLink = model.MenuLink;
                item.SortId = model.SortId;
                item.StoredProceduresName = model.StoredProceduresName;
                item.ReportType = model.ReportType;
                item.UpperId = model.UpperId;
                item.Status = model.Status;
                item.UpdateDate = DateTime.Now;

                item.ChartName = model.ChartName;
                item.ChartNameEn = model.ChartNameEn;
                item.ChartNameVn = model.ChartNameVn;
                item.ChartNameCn = model.ChartNameCn;
                item.ChartUnit = model.ChartUnit;
                item.MenuType = model.MenuType;


                item.FarmGgp = model.FarmGgp;
                item.FarmGp = model.FarmGp;
                item.FarmGrower = model.FarmGrower;
                item.FarmNursery = model.FarmNursery;
                item.FarmPmpf = model.FarmPmpf;
                item.FarmSemen = model.FarmSemen;

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
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }


        public async Task<object> GetMenusByMenuType(string lang = "tw", string menuType = "BE")
        {
            string token = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            var accountId = JWTExtensions.GetDecodeTokenByID(token).ToDecimal();
            if (menuType == "BE") {
             var account = await _repoXAccount.FindAll(x => x.Status == "1" && x.AccountId == accountId).FirstOrDefaultAsync();
            if (account == null) return new List<dynamic> { };
            }
          

            var query = await (from x in _repo.FindAll(x => x.Status == 1 && menuType == x.MenuType)
                               select new
                               {
                                   UpperId = x.UpperId == 0 ? null : x.UpperId,
                                   FunctionCode = x.Type,
                                   MenuType = x.MenuType,
                                   x.Id,
                                   Url = x.MenuLink,
                                   SortId = x.SortId ?? 0,
                                   Icon = x.MenuIcon,
                                   x.FarmGgp,
                                   x.FarmGp,
                                   x.FarmPmpf,
                                   x.FarmGrower,
                                   x.FarmNursery,
                                   x.FarmSemen,
                                   Name = lang == Languages.EN ? (x.MenuNameEn == "" || x.MenuNameEn == null ? x.MenuName : x.MenuNameEn) : lang == Languages.VI ? (x.MenuNameVn == "" || x.MenuNameVn == null ? x.MenuName : x.MenuNameVn) : lang == Languages.TW ? x.MenuName : lang == Languages.CN ? (x.MenuNameCn == "" || x.MenuNameCn == null ? x.MenuName : x.MenuNameCn) : x.MenuName

                               }).ToListAsync();
            var queryTemp = query.Select(x => new
            {

                UpperId = x.UpperId,
                FunctionCode = x.FunctionCode,
                Id = x.Id,
                Url = x.Url,
                SortId = x.SortId,
                Icon = x.Icon,
                Name = x.Name,
                Ggp = x.FarmGgp,
                Gp = x.FarmGp,
                Pmpf = x.FarmPmpf,
                Semen = x.FarmSemen,
                Nursery = x.FarmNursery,
                Grower = x.FarmGrower,
            });

            return queryTemp.AsHierarchy(x => x.Id, y => y.UpperId, null, 3).Select(x => new
            {
                x.Entity.Url,
                x.Entity.Icon,
                x.Entity.Name,
                x.Entity.FunctionCode,
                x.Entity.SortId,
                x.HasChildren,
                Level = x.Depth,
                Children = x.ChildNodes.Select(a => new
                {
                    a.Entity.Url,
                    a.Entity.Icon,
                    a.Entity.Name,
                    a.Entity.FunctionCode,
                    a.HasChildren,
                    a.Entity.SortId,
                    Level = a.Depth,
                    Children = a.ChildNodes.Select(b => new
                    {
                        b.Entity.Url,
                        b.Entity.Icon,
                        b.Entity.Name,
                        b.Entity.FunctionCode,
                        HasChildren = false,
                        b.Entity.SortId,
                        Level = b.Depth,
                        Children = new List<dynamic>()
                    }).OrderBy(b => b.SortId)
                }).OrderBy(a => a.SortId)
            }).OrderBy(x => x.SortId);
        }
        public async Task<object> GetMenus(string lang = "tw")
        {
            string token = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            var accountId = JWTExtensions.GetDecodeTokenByID(token).ToDecimal();
            var account = await _repoXAccount.FindAll(x => x.Status == "1" && x.AccountId == accountId).FirstOrDefaultAsync();
            if (account == null) return new List<dynamic> { };

            var query = await (from x in _repo.FindAll(x => x.Status == 1)
                               select new
                               {
                                   UpperId = x.UpperId == 0 ? null : x.UpperId,
                                   FunctionCode = x.Type,
                                   x.Id,
                                   Url = x.MenuLink,
                                   SortId = x.SortId ?? 0,
                                   Icon = x.MenuIcon,
                                   x.FarmGgp,
                                   x.FarmGp,
                                   x.FarmPmpf,
                                   x.FarmGrower,
                                   x.FarmNursery,
                                   x.FarmSemen,
                                   Name = lang == Languages.EN ? (x.MenuNameEn == "" || x.MenuNameEn == null ? x.MenuName : x.MenuNameEn) : lang == Languages.VI ? (x.MenuNameVn == "" || x.MenuNameVn == null ? x.MenuName : x.MenuNameVn) : lang == Languages.TW ? x.MenuName : lang == Languages.CN ? (x.MenuNameCn == "" || x.MenuNameCn == null ? x.MenuName : x.MenuNameCn) : x.MenuName

                               }).ToListAsync();
            var queryTemp = query.Select(x => new
            {

                UpperId = x.UpperId,
                FunctionCode = x.FunctionCode,
                Id = x.Id,
                Url = x.Url,
                SortId = x.SortId,
                Icon = x.Icon,
                Name = x.Name,
                Ggp = x.FarmGgp,
                Gp = x.FarmGp,
                Pmpf = x.FarmPmpf,
                Semen = x.FarmSemen,
                Nursery = x.FarmNursery,
                Grower = x.FarmGrower,
            });

            return queryTemp.AsHierarchy(x => x.Id, y => y.UpperId, null, 3).Select(x => new
            {
                x.Entity.Url,
                x.Entity.Icon,
                x.Entity.Name,
                x.Entity.FunctionCode,
                x.Entity.SortId,
                x.HasChildren,
                Level = x.Depth,
                Children = x.ChildNodes.Select(a => new
                {
                    a.Entity.Url,
                    a.Entity.Icon,
                    a.Entity.Name,
                    a.Entity.FunctionCode,
                    a.HasChildren,
                    a.Entity.SortId,
                    Level = a.Depth,
                    Children = a.ChildNodes.Select(b => new
                    {
                        b.Entity.Url,
                        b.Entity.Icon,
                        b.Entity.Name,
                        b.Entity.FunctionCode,
                        HasChildren = false,
                        b.Entity.SortId,
                        Level = b.Depth,
                        Children = new List<dynamic>()
                    }).OrderBy(b => b.SortId)
                }).OrderBy(a => a.SortId)
            }).OrderBy(x => x.SortId);
        }
        public async Task<object> GetMenusByFarm(string farmGuid, string lang = "tw")
        {
            string token = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            var accountId = JWTExtensions.GetDecodeTokenByID(token).ToDecimal();
            var account = await _repoXAccount.FindAll(x => x.Status == "1" && x.AccountId == accountId).FirstOrDefaultAsync();


            if (account == null) return new List<dynamic> { };
            var group = await _repoXAccountGroup.FindAll(x => x.Guid == account.AccountGroup).Select(x => new { x.GroupNo }).FirstOrDefaultAsync();


            var query = await (from x in _repo.FindAll(x => x.Status == 1)
                               select new
                               {
                                   UpperId = x.UpperId == 0 ? null : x.UpperId,
                                   FunctionCode = x.Type,
                                   x.Id,
                                   Url = x.MenuLink,
                                   SortId = x.SortId ?? 0,
                                   Icon = x.MenuIcon,
                                   x.FarmGgp,
                                   x.FarmGp,
                                   x.FarmPmpf,
                                   x.FarmGrower,
                                   x.FarmNursery,
                                   x.FarmSemen,
                                   Name = lang == Languages.EN ? (x.MenuNameEn == "" || x.MenuNameEn == null ? x.MenuName : x.MenuNameEn) : lang == Languages.VI ? (x.MenuNameVn == "" || x.MenuNameVn == null ? x.MenuName : x.MenuNameVn) : lang == Languages.TW ? x.MenuName : lang == Languages.CN ? (x.MenuNameCn == "" || x.MenuNameCn == null ? x.MenuName : x.MenuNameCn) : x.MenuName

                               }).ToListAsync();
            var queryTemp = query.Select(x => new
            {

                UpperId = x.UpperId,
                FunctionCode = x.FunctionCode,
                Id = x.Id,
                Url = x.Url,
                SortId = x.SortId,
                Icon = x.Icon,
                Name = x.Name,
                Ggp = x.FarmGgp,
                Gp = x.FarmGp,
                Pmpf = x.FarmPmpf,
                Semen = x.FarmSemen,
                Nursery = x.FarmNursery,
                Grower = x.FarmGrower,
            });

            return queryTemp.AsHierarchy(x => x.Id, y => y.UpperId, null, 3).Select(x => new
            {
                x.Entity.Id,
                x.Entity.Url,
                x.Entity.Icon,
                x.Entity.Name,
                x.Entity.FunctionCode,
                x.Entity.SortId,
                x.HasChildren,
                Level = x.Depth,
                Children = x.ChildNodes.Select(a => new
                {
                    a.Entity.Id,
                    a.Entity.Url,
                    a.Entity.Icon,
                    a.Entity.Name,
                    a.Entity.FunctionCode,
                    a.HasChildren,
                    a.Entity.SortId,
                    Level = a.Depth,
                    Children = a.ChildNodes.Select(b => new
                    {
                        b.Entity.Id,
                        b.Entity.Url,
                        b.Entity.Icon,
                        b.Entity.Name,
                        b.Entity.FunctionCode,
                        HasChildren = false,
                        b.Entity.SortId,
                        Level = b.Depth,
                        Children = new List<dynamic>()
                    }).OrderBy(b => b.SortId)
                }).OrderBy(a => a.SortId)
            }).OrderBy(x => x.SortId);
        }
        public async Task<object> LoadData(DataManager data, decimal upperId)
        {
            if (upperId > 0)
            {
                var datasource = _repo.FindAll(x => x.UpperId == upperId).OrderByDescending(x => x.Id).Select(x => new
                {
                    x.Id,
                    x.Type,
                    x.MenuName,
                    x.MenuLink,
                    x.MenuNameEn,
                    x.MenuNameVn,
                    x.MenuNameCn,
                    x.MenuIcon,
                    x.Comment,
                    x.UpperId,
                    x.SortId,
                    x.Status,
                    x.FarmGgp,
                    x.FarmGp,
                    x.FarmGrower,
                    x.FarmNursery,
                    x.FarmPmpf,
                    x.FarmSemen,
                    x.StoredProceduresName,
                    x.ReportType,
                    x.MenuType
                });
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
            else
            {
                var datasource = _repo.FindAll().OrderByDescending(x => x.Id).Select(x => new
                {
                    x.Id,
                    x.Type,
                    x.MenuName,
                    x.MenuLink,
                    x.MenuNameEn,
                    x.MenuNameVn,
                    x.MenuNameCn,
                    x.MenuIcon,
                    x.Comment,
                    x.UpperId,
                    x.SortId,
                    x.Status,
                    x.FarmGgp,
                    x.FarmGp,
                    x.FarmGrower,
                    x.FarmNursery,
                    x.FarmPmpf,
                    x.FarmSemen,
                    x.ReportType,
                    x.StoredProceduresName,
                    x.MenuType

                });
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
        public async Task<object> LoadData(DataManager data)
        {
            var datasource = _repo.FindAll().OrderByDescending(x => x.Id).Select(x => new
            {
                x.Id,
                x.Type,
                x.Guid,
                x.MenuName,
                x.MenuLink,
                x.MenuNameEn,
                x.MenuNameVn,
                x.MenuNameCn,
                x.ChartUnit,
                x.ChartName,
                x.ChartNameEn,
                x.ChartNameVn,
                x.ChartNameCn,
                x.MenuType,
                x.MenuIcon,
                x.Comment,
                x.UpperId,
                x.StoredProceduresName,
                x.ReportType,
                x.SortId,
                x.Status,
                x.FarmGgp,
                x.FarmGp,
                x.FarmGrower,
                x.FarmNursery,
                x.FarmPmpf,
                x.FarmSemen

            });
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

        public async Task<object> GetParents(string lang)
        {
            var query = from x in _repo.FindAll(x => x.Status == 1).AsNoTracking()
                        select new
                        {
                            x.Id,
                            Url = x.MenuLink,
                            UpperId = x.UpperId,
                            SortId = x.SortId ?? 0,
                            Icon = x.MenuIcon,
                            Name = lang == Languages.EN ? (x.MenuNameEn == "" || x.MenuNameEn == null ? x.MenuName : x.MenuNameEn) : lang == Languages.VI ? (x.MenuNameVn == "" || x.MenuNameVn == null ? x.MenuName : x.MenuNameVn) : lang == Languages.TW ? x.MenuName : lang == Languages.CN ? (x.MenuNameCn == "" || x.MenuNameCn == null ? x.MenuName : x.MenuNameCn) : x.MenuName
                        };

            var data3 = await query.ToListAsync();
            return data3;

        }
        public async Task<object> GetToolbarParents(string lang)
        {
            var query = from x in _repo.FindAll(x => x.Status == 1 && (!x.UpperId.HasValue || x.UpperId.Value == 0))
                        .OrderBy(x => x.SortId)
                        .AsNoTracking()
                        select new
                        {
                            x.Id,
                            Name = lang == Languages.EN ? (x.MenuNameEn == "" || x.MenuNameEn == null ? x.MenuName : x.MenuNameEn) : lang == Languages.VI ? (x.MenuNameVn == "" || x.MenuNameVn == null ? x.MenuName : x.MenuNameVn) : lang == Languages.TW ? x.MenuName : lang == Languages.CN ? (x.MenuNameCn == "" || x.MenuNameCn == null ? x.MenuName : x.MenuNameCn) : x.MenuName

                        };

            var data3 = await query.ToListAsync();
            return data3;

        }
        public async Task<object> GetToolbarParentsLevel2(string lang, int upperId)
        {
            var query = from x in _repo.FindAll(x => x.Status == 1 && x.UpperId == upperId)
                        .OrderBy(x => x.SortId)
                        .AsNoTracking()
                        select new
                        {
                            x.Id,
                            Name = lang == Languages.EN ? (x.MenuNameEn == "" || x.MenuNameEn == null ? x.MenuName : x.MenuNameEn) : lang == Languages.VI ? (x.MenuNameVn == "" || x.MenuNameVn == null ? x.MenuName : x.MenuNameVn) : lang == Languages.TW ? x.MenuName : lang == Languages.CN ? (x.MenuNameCn == "" || x.MenuNameCn == null ? x.MenuName : x.MenuNameCn) : x.MenuName

                        };

            var data3 = await query.ToListAsync();
            return data3;

        }
        public async Task<object> GetItemByKind(string lang, string kind)
        {
            string menuLink = kind;
            var query = from x in _repo.FindAll(x => x.Status == 1 && x.MenuLink == menuLink).AsNoTracking()
                        select new
                        {
                            x.Id,
                            Url = x.MenuLink,
                            UpperId = x.UpperId,
                            SortId = x.SortId ?? 0,
                            Icon = x.MenuIcon,
                            Name = lang == Languages.EN ? (x.MenuNameEn == "" || x.MenuNameEn == null ? x.MenuName : x.MenuNameEn) : lang == Languages.VI ? (x.MenuNameVn == "" || x.MenuNameVn == null ? x.MenuName : x.MenuNameVn) : lang == Languages.TW ? x.MenuName : lang == Languages.CN ? (x.MenuNameCn == "" || x.MenuNameCn == null ? x.MenuName : x.MenuNameCn) : x.MenuName

                        };

            var data3 = await query.FirstOrDefaultAsync();
            return data3;
        }

        public async Task<string> GetStoredProceduresName(string guid)
        {
            var item = await _repo.FindAll(x => x.Status == 1 && x.Guid == guid).FirstOrDefaultAsync();
            if (item != null)
                return item.StoredProceduresName;
            return string.Empty;
        }

        public async Task<object> LoadReportChartConfigMenuData(DataManager data, string reportType)
        {
            var datasource = _repo.FindAll(x => x.Status == 1 && x.Type == SystemReport.ReportChartConfig && reportType == x.ReportType).OrderByDescending(x => x.Id).Select(x => new
            {
                x.Id,
                x.Type,
                x.Guid,
                x.MenuName,
                x.MenuLink,
                x.MenuNameEn,
                x.MenuNameVn,
                x.MenuNameCn,
                x.ChartUnit,
                x.ChartName,
                x.ChartNameEn,
                x.ChartNameVn,
                x.ChartNameCn,

                x.MenuIcon,
                x.Comment,
                x.UpperId,
                x.StoredProceduresName,
                x.ReportType,
                x.SortId,
                x.Status,
                x.FarmGgp,
                x.FarmGp,
                x.FarmGrower,
                x.FarmNursery,
                x.FarmPmpf,
                x.FarmSemen
            });
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

        public async Task<object> LoadReportMenuData(DataManager data, string reportType)
        {
            var datasource = _repo.FindAll(x => x.Status == 1 && x.Type == SystemReport.Report && reportType == x.ReportType).OrderByDescending(x => x.Id).Select(x => new
            {
                x.Id,
                x.Type,
                x.Guid,
                x.MenuName,
                x.MenuLink,
                x.MenuNameEn,
                x.MenuNameVn,
                x.MenuNameCn,
                x.ChartUnit,
                x.ChartName,
                x.ChartNameEn,
                x.ChartNameVn,
                x.ChartNameCn,

                x.MenuIcon,
                x.Comment,
                x.UpperId,
                x.StoredProceduresName,
                x.ReportType,
                x.SortId,
                x.Status,
                x.FarmGgp,
                x.FarmGp,
                x.FarmGrower,
                x.FarmNursery,
                x.FarmPmpf,
                x.FarmSemen
            });
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
    }
}
