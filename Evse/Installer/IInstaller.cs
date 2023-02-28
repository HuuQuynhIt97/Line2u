using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Evse.Installer
{
    public interface IInstaller
    {
        void InstallServices(IServiceCollection services, IConfiguration configuration);
    }
}
