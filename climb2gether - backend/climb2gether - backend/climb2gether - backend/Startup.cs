using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;
using climb2gether___backend.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using climb2gether___backend.Options;
using System.Reflection;
using Swashbuckle.Swagger;
using climb2gether___backend.Installers;
using Microsoft.IdentityModel.Logging;

namespace climb2gether___backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.InstallServicesInAssembly(Configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                //app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseHsts();
            }

            IdentityModelEventSource.ShowPII = true;

            var swaggerOptions = new SwaggerOptions();
            Configuration.GetSection(nameof(SwaggerOptions)).Bind(swaggerOptions);

            app.UseSwagger(options =>
            {
                options.RouteTemplate = swaggerOptions.JsonRoute;
            });

            app.UseCors("ApiCorsPolicy");

            app.UseSwaggerUI(options => { options.SwaggerEndpoint(swaggerOptions.UIEndpoint, swaggerOptions.Description); });

            app.UseHttpsRedirection();
            app.UseStaticFiles();



            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });
        }
    }
}
