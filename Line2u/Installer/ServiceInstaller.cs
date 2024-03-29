﻿using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Line2u.Helpers;
using Line2u.Services;

namespace Line2u.Installer
{
    public class ServiceInstaller : IInstaller
    {
        public void InstallServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IMailingService, MailingService>();
         
            services.AddScoped<ISequenceService, SequenceService>();

            services.AddScoped<IEmployeeService, EmployeeService>();
            services.AddScoped<ISystemLanguageService, SystemLanguageService>();

            services.AddScoped<IXAccountService, XAccountService>();
            services.AddScoped<IXAccountGroupService, XAccountGroupService>();
            services.AddScoped<ISysMenuService, SysMenuService>();
         

            services.AddScoped<ILineService, LineService>();
            services.AddScoped<IReportService, ReportService> ();
            services.AddScoped<ICodePermissionService, CodePermissionService>();
         
            services.AddScoped<ICodeTypeService, CodeTypeService>();
            services.AddScoped<ISystemConfigService, SystemConfigService>();
          
        }
    }
}
