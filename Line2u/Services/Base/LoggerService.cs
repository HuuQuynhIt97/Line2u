﻿using AutoMapper;
using Line2u.Data;
using Line2u.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Line2u.DTO;
using System.Net;
using Line2u.Constants;
using Line2u.Models;
using Syncfusion.JavaScript;
using Syncfusion.JavaScript.DataSources;
using Microsoft.Data.SqlClient;
using NetUtility;
using Microsoft.Extensions.Configuration;
using System.Data;
using Microsoft.AspNetCore.Http;
using Dapper;

namespace Line2u.Services
{
    public class LoggerParams
    {
        public string Type { get; set; }
        public string LogText { get; set; }
    }

    public interface ILine2uLoggerService
    {
        Task LogStoreProcedure(LoggerParams model);
    }

    public class Line2uLoggerService : ILine2uLoggerService, IScopeService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;
        public Line2uLoggerService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;

        }
        public async Task LogStoreProcedure(LoggerParams model)
        {
            //#if DEBUG
            //            await Task.CompletedTask.ConfigureAwait(false);
            //#else
            using (SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                var Context = _httpContextAccessor.HttpContext;
                var url = Context == null ? "" : string.Format("{0}://{1}{2}{3}", Context.Request.Scheme, Context.Request.Host, Context.Request.Path, Context.Request.QueryString);
                var remoteIpAddress = Context == null ? "" : Context.Connection.RemoteIpAddress.ToString();
                string sql = "SP_Save_SYS_LOG";
                string token = Context == null ? "" : Context.Request.Headers["Authorization"];
                var accountId = token == "" ? 0 : JWTExtensions.GetDecodeTokenByID(token);

                if (model.LogText.Length > 200)
                {
                    url += " Log Text ======> " + model.LogText;
                    string text = model.LogText.Substring(0, 200);
                    model.LogText = text;
                }
                var parameters = new
                {
                    @LOG_Type = model.Type,
                    @LOG_TEXT = model.LogText,
                    @Account_ID = accountId,
                    @LOG_IP = remoteIpAddress,
                    @LOG_WIP = remoteIpAddress,
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
            //#endif

        }


    }
}
