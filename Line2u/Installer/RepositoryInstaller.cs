using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Line2u.Data;
using System;

namespace Line2u.Installer
{
    public class RepositoryInstaller : IInstaller
    {
        public void InstallServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped(typeof(IRepositoryBase<>), typeof(RepositoryBase<>));
        }
    }
}
