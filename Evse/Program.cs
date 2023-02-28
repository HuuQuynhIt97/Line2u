using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Evse.Helpers;
using System.Linq;
using System.Net;

namespace Evse
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //var a = "1".ToEncrypt();
            //var dara = "Server=www.acv-vision.com,1466;Database=Evse_Peter;MultipleActiveResultSets=true;User ID=Evse-user;Password=Evse-userapp".ToEncrypt();
            CreateHostBuilder(args).Build().Run();
        }
     
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
#if DEBUG
                    webBuilder.UseKestrel(opts =>
                    {
                        string HostName = Dns.GetHostName();
                        IPAddress[] ipaddress = Dns.GetHostAddresses(HostName);
                        foreach (IPAddress ip4 in ipaddress.Where(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork))
                        {
                            opts.Listen(ip4, port: 58);
                        }
                        opts.ListenAnyIP(port: 58);

                    });
#endif

                });

    }
}
