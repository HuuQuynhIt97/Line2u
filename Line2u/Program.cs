using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Line2u.Helpers;
using System.Linq;
using System.Net;

namespace Line2u
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //var a = "1".ToEncrypt();
            //var dara = "Server=www.acv-vision.com,1466;Database=Line2u_Peter;MultipleActiveResultSets=true;User ID=Line2u-user;Password=Line2u-userapp".ToEncrypt();
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
