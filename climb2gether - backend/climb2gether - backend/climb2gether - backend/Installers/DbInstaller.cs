using climb2gether___backend.Data;
using climb2gether___backend.Domain;
using climb2gether___backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Installers
{
    public class DbInstaller : IInstaller
    {
        public void InstallServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<DataContext>(options =>
                 options.UseSqlServer(
                     configuration.GetConnectionString("DefaultConnection")));
            services.AddDefaultIdentity<User>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddRoles<IdentityRole<int>>()
                .AddEntityFrameworkStores<DataContext>();

            services.AddScoped<IPostService, PostService>();
            services.AddScoped<IOfferService, OfferService>();
            services.AddScoped<IExpeditionsService, ExpeditionsService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<IRockSchemaService, RockSchemaService>();
            services.AddScoped<INotificationsService, NotificationsService>();


        }
    }
}
