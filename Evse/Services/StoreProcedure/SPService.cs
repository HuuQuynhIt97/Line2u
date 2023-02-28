using Microsoft.EntityFrameworkCore;
using Evse.Constants;
using Evse.DTO;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using NetUtility;
using Microsoft.Data.SqlClient;
using System.Data;
using Dapper;

namespace Evse.Services
{

    public interface ISPService
    {
        Task<object> GetWebBanners();
        Task<object> GetWebNews();
        Task<object> GetWebPages();
        Task Breeding2SowIn(string recordGuid, string storeProcedureName);
        Task Sow(string recordGuid, string storeProcedureName);
        Task Suckling(string recordGuid, string storeProcedureName);
        Task Breeding(string recordGuid, string storeProcedureName);
        Task GiltIn(string recordGuid, string storeProcedureName);
        Task NewBoarIn(string recordGuid, string storeProcedureName);
        Task<object> GetBreedingByFarmGuid(string farmGuid);
        Task<object> SowGetListBase(string breedingGuid, string storeProcedureName);
        /// <summary>
        /// SP_GetBreeding2SowInV2
        /// </summary>
        /// <param name="breedingGuid"></param>
        /// <returns></returns>
        Task<object> GetBreeding2SowInByBreedingGuid(string breedingGuid);
        Task<bool> Born(string recordGuid, int qtyTotal, int qtyaLive);
        Task<object> DashboarConfig1();
        Task<object> DashboarConfig2();
        Task<object> SP_Record_AccountCheck_Born(string recordGuid);
        Task<object> SP_Record_AccountCheck_Remove(string recordGuid);
        Task<object> SP_Record_AccountCheck_Confirm(string accountGuid);
        Task<object> SP_Record_AccountCheck_NeedCheck(string accountGuid);
    }

    public class SPService : ISPService, IScopeService
    {
        private readonly IConfiguration _config;
        private readonly string _defaultConnection;

        private readonly IEvseLoggerService _logger;

        public SPService(IConfiguration config, IEvseLoggerService logger)
        {
            _config = config;
            _logger = logger;
            _defaultConnection = _config.GetConnectionString("DefaultConnection");

        }
      
   public async Task<object> GetWebBanners()
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = "GetWebBanners";
                var parameters = new { };
                try
                {
                    var datasource = await conn.QueryAsync(sql, commandType: CommandType.StoredProcedure);
                    return await Task.FromResult(datasource);
                }
                catch
                {
                    return new List<dynamic> { };

                }

            }

        }
       public async Task<object> GetWebPages()
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = "GetWebPages";
                var parameters = new { };
                try
                {
                    var datasource = await conn.QueryAsync(sql, commandType: CommandType.StoredProcedure);
                    return await Task.FromResult(datasource);
                }
                catch
                {
                    return new List<dynamic> { };

                }

            }

        }
       public async Task<object> GetWebNews()
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = "GetWebNews";
                var parameters = new { };
                try
                {
                    var datasource = await conn.QueryAsync(sql, commandType: CommandType.StoredProcedure);
                    return await Task.FromResult(datasource);
                }
                catch
                {
                    return new List<dynamic> { };

                }

            }

        }


     
        public async Task<object> DashboarConfig1()
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = "DashboardConfig1";
                var parameters = new { };
                try
                {
                    var datasource = await conn.QueryAsync(sql, commandType: CommandType.StoredProcedure);
                    return await Task.FromResult(datasource);
                }
                catch
                {
                    return new List<dynamic> { };

                }

            }

        }
        public async Task<object> DashboarConfig2()
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = "DashboardConfig2";
                var parameters = new { };
                try
                {
                    var datasource = await conn.QueryAsync(sql, commandType: CommandType.StoredProcedure);
                    return await Task.FromResult(datasource);
                }
                catch
                {
                    return new List<dynamic> { };

                }

            }

        }
        /// <summary>
        /// SP_GetBreeding2SowInV2
        /// </summary>
        /// <param name="breedingGuid"></param>
        /// <returns></returns>
        public async Task<object> GetBreeding2SowInByBreedingGuid(string breedingGuid)
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = "SP_GetBreeding2SowInV2";
                var parameters = new { @Breeding_GUID = breedingGuid };
                try
                {
                    var datasource = await conn.QueryAsync(sql, parameters, commandType: CommandType.StoredProcedure);
                    return await Task.FromResult(datasource);
                }
                catch
                {
                    return new List<dynamic> { };

                }

            }

        }
        public async Task<object> GetBreedingByFarmGuid(string farmGuid)
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = "SP_GetBreedingByFarmGuid";
                var parameters = new { @Farm_GUID = farmGuid };
                try
                {
                    var datasource = await conn.QueryAsync(sql, parameters, commandType: CommandType.StoredProcedure);
                    return await Task.FromResult(datasource);
                }
                catch
                {
                    return new List<dynamic> { };

                }

            }

        }
        public async Task Breeding2SowIn(string recordGuid, string storeProcedureName)
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = storeProcedureName;
                var parameters = new { @Record_GUID = recordGuid };
                try
                {
                    await conn.QueryAsync(sql, parameters, commandType: CommandType.StoredProcedure);
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"The {storeProcedureName} executed successfully"
                    }).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                    }).ConfigureAwait(false);
                }

            }
        }

        public async Task Sow(string recordGuid, string storeProcedureName)
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = storeProcedureName;
                var parameters = new { @Record_GUID = recordGuid };
                try
                {
                    await conn.QueryAsync(sql, parameters, commandType: CommandType.StoredProcedure);
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"The {storeProcedureName} executed successfully"
                    }).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                    }).ConfigureAwait(false);
                }

            }
        }
        public async Task Suckling(string recordGuid, string storeProcedureName)
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = storeProcedureName;
                var parameters = new { @Record_GUID = recordGuid };
                try
                {
                    await conn.QueryAsync(sql, parameters, commandType: CommandType.StoredProcedure);
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"The {storeProcedureName} executed successfully"
                    }).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                    }).ConfigureAwait(false);
                }

            }
        }
        public async Task Breeding(string breedingGuid, string storeProcedureName)
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = storeProcedureName;
                var parameters = new { @Breeding_GUID = breedingGuid };
                try
                {
                    await conn.QueryAsync(sql, parameters, commandType: CommandType.StoredProcedure);
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"The {storeProcedureName} executed successfully"
                    }).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                    }).ConfigureAwait(false);
                }

            }
        }
        public async Task NewBoarIn(string recordGuid, string storeProcedureName)
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = storeProcedureName;
                var parameters = new { @Record_GUID = recordGuid };
                try
                {
                    await conn.QueryAsync(sql, parameters, commandType: CommandType.StoredProcedure);
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"The {storeProcedureName} executed successfully"
                    }).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                    }).ConfigureAwait(false);
                }

            }
        }

        public async Task GiltIn(string recordGuid, string storeProcedureName)
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = storeProcedureName;
                var parameters = new { @Record_GUID = recordGuid };
                try
                {
                    await conn.QueryAsync(sql, parameters, commandType: CommandType.StoredProcedure);
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"The {storeProcedureName} executed successfully"
                    }).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                    }).ConfigureAwait(false);
                }

            }
        }
        public async Task<object> SowGetListBase(string breedingGuid, string storeProcedureName)
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = storeProcedureName;
                var parameters = new { @Breeding_GUID = breedingGuid };
                try
                {
                    return await conn.QueryAsync(sql, parameters, commandType: CommandType.StoredProcedure);
                }
                catch (Exception ex)
                {
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"SP: {storeProcedureName}, Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                    }).ConfigureAwait(false);
                    return new List<object> { };
                }

            }
        }

        public async Task<bool> Born(string recordGuid, int qtyTotal, int qtyaLive)
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = "SP_Sow_Farrow_Born";
                var parameters = new
                {
                    @Record_GUID = recordGuid,
                    @Qty_aLive = qtyaLive,
                    @Qty_Total = qtyTotal,
                };
                try
                {
                    await conn.QueryAsync(sql, parameters, commandType: CommandType.StoredProcedure);
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"The SP_Sow_Farrow_Born Record_GUID={recordGuid} Qty_Total={qtyTotal} executed successfully"
                    }).ConfigureAwait(false);
                    return true;
                }
                catch (Exception ex)
                {
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"SP: SP_Sow_Farrow_Born, Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                    }).ConfigureAwait(false);
                    return false;
                }

            }

        }

        public async Task<object> SP_Record_AccountCheck_Born(string recordGuid)
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = "SP_Record_AccountCheck_Born";
                var parameters = new
                {
                    @Record_GUID = recordGuid
                };
                try
                {
                    await conn.QueryAsync(sql, parameters, commandType: CommandType.StoredProcedure);
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"The SP_Record_AccountCheck_Born Record_GUID={recordGuid} executed successfully"
                    }).ConfigureAwait(false);
                    return true;
                }
                catch (Exception ex)
                {
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"SP: SP_Record_AccountCheck_Born, Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                    }).ConfigureAwait(false);
                    return false;
                }

            }
        }

        public async Task<object> SP_Record_AccountCheck_Confirm(string accountGuid)
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql =  SP.Account.SP_Record_AccountCheck_Confirm;
                var parameters = new
                {
                    @Account_GUID = accountGuid
                };
                try
                {
                    await conn.QueryAsync(sql, parameters, commandType: CommandType.StoredProcedure);
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"The SP_Record_AccountCheck_Confirm Account_GUID={accountGuid} executed successfully"
                    }).ConfigureAwait(false);
                    return true;
                }
                catch (Exception ex)
                {
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"SP: SP_Record_AccountCheck_Confirm, Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                    }).ConfigureAwait(false);
                    return false;
                }

            }
        }

    public async Task<object> SP_Record_AccountCheck_Remove(string recordGuid)
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql =  SP.Account.SP_Record_AccountCheck_Remove;
                var parameters = new
                {
                    @Record_GUID = recordGuid
                };
                try
                {
                    await conn.QueryAsync(sql, parameters, commandType: CommandType.StoredProcedure);
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"The SP_Record_AccountCheck_Remove Record_GUID={recordGuid} executed successfully"
                    }).ConfigureAwait(false);
                    return true;
                }
                catch (Exception ex)
                {
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"SP: SP_Record_AccountCheck_Remove, Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                    }).ConfigureAwait(false);
                    return false;
                }

            }
        }



 public async Task<object> SP_Record_AccountCheck_NeedCheck(string accountGuid)
        {
            using (SqlConnection conn = new SqlConnection(_defaultConnection))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                string sql = SP.Account.SP_Record_AccountCheck_NeedCheck;
              
                 var parameters = new DynamicParameters();
                 parameters.Add("@Account_GUID", accountGuid);
                 parameters.Add("@result", dbType: DbType.Int32, direction: ParameterDirection.ReturnValue);
               
                try
                {
                    await conn.QueryAsync(sql, parameters, commandType: CommandType.StoredProcedure);
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"The SP_Record_AccountCheck_NeedCheck Account_GUID={accountGuid} executed successfully"
                    }).ConfigureAwait(false);
                    var result= parameters.Get<int>("@result");
                    return result;
                }
                catch (Exception ex)
                {
                    await _logger.LogStoreProcedure(new LoggerParams
                    {
                        Type = EvseLogConst.StoredProcedure,
                        LogText = $"SP: SP_Record_AccountCheck_NeedCheck, Type: {ex.GetType().Name}, Message: {ex.Message}, StackTrace: {ex.ToString()}"
                    }).ConfigureAwait(false);
                    return null;
                }

            }
        }

    }
}