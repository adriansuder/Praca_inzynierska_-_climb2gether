
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using climb2gether___backend.Options;
using climb2gether___backend.Installers;
using Microsoft.IdentityModel.Logging;
using AutoMapper;
using Swashbuckle.AspNetCore.SwaggerGen;
using climb2gether___backend.Data;
using Microsoft.EntityFrameworkCore;

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
            services.AddAutoMapper(typeof(Startup));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DataContext _dataContext)
        {
           // _dataContext.Database.EnsureCreated();
           // _dataContext.Database.Migrate();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
               // _dataContext.Database.Migrate();
            }

            IdentityModelEventSource.ShowPII = true;

            app.UseSwagger(o => o.RouteTemplate = "swagger/{documentName}/swagger.json") ;
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint(
                    "v1/swagger.json",
                    "Our API"
                    );
            });
            app.UseCors("ApiCorsPolicy");
      
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
