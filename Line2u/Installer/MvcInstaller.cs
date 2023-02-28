using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Line2u.Data;
using Line2u.Helpers;
using Line2u.Helpers.AutoMapper;
using Line2u.Models;
using System;
using System.Collections.Generic;

namespace Line2u.Installer
{
    public class MvcInstaller : IInstaller
    {
        public void InstallServices(IServiceCollection services, IConfiguration configuration)
        {
            var connetionString = configuration.GetConnectionString("DefaultConnection");
            // Configure DbContext with Scoped lifetime   
            services.AddDbContext<Line2uDataContext>(options =>
            {
                options.UseSqlServer(connetionString);
            });

            services.AddScoped<Func<Line2uDataContext>>((provider) => () => provider.GetService<Line2uDataContext>());
            services.AddResponseCaching();
            services.AddScoped<DbFactory>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped(typeof(IRepositoryBase<>), typeof(RepositoryBase<>));
            //var sp = services.BuildServiceProvider();
            //var context = (Line2uContext)sp.GetService(typeof(Line2uContext));
            //Helpers.DBInitializer.Seed(context);

            services
                .AddAutoMapper(typeof(Startup))
                .AddScoped<IMapper>(sp =>
                {
                    return new Mapper(AutoMapperConfig.RegisterMappings());
                })
                .AddSingleton(AutoMapperConfig.RegisterMappings());

            //Swagger
            services.AddSwaggerGen(x =>
            {
                x.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Our KPI", Version = "v1" });

                var security = new Dictionary<string, IEnumerable<string>>
                {
                    {"Bearer", new string[0]}
                };
                x.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });
                x.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,
                        },
                        new List<string>()
                    }
                });
            });
        }
    }
}
