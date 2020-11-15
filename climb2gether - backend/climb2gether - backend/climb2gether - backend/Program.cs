using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using climb2gether___backend.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace climb2gether___backend
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            //using(var serviceScope = host.Services.CreateScope())
            //{
            //    var dbContext = serviceScope.ServiceProvider.GetRequiredService<DataContext>();
            //    await dbContext.Database.MigrateAsync();
            //    var roleManager = serviceScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            //    if (!await roleManager.RoleExistsAsync("SuperAdmin"))
            //    {
            //        var newRole = new IdentityRole("SuperAdmin");
            //        await roleManager.CreateAsync(newRole);
            //    }
            //    else if (!await roleManager.RoleExistsAsync("Admin"))
            //    {
            //        var newRole = new IdentityRole("Admin");
            //        await roleManager.CreateAsync(newRole);
            //    }
            //    else if (!await roleManager.RoleExistsAsync("User"))
            //    {
            //        var newRole = new IdentityRole("User");
            //        await roleManager.CreateAsync(newRole);
            //    }
            //}

            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
