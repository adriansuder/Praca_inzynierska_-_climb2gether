
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using climb2gether___backend.Options;
using Microsoft.IdentityModel.Logging;
using AutoMapper;
using climb2gether___backend.Data;
using Microsoft.EntityFrameworkCore;
using System;
using climb2gether___backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Collections.Generic;
using System.Text;
using climb2gether___backend.Domain;
using Microsoft.AspNetCore.Identity;

namespace climb2gether___backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }


        public void ConfigureServices(IServiceCollection services)
        {

            var jwtSettings = new JwtSettings();
            Configuration.Bind(nameof(jwtSettings), jwtSettings);
            services.AddSingleton(jwtSettings);

            services.AddScoped<IIdentityService, IdentityService>();

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings.Secret)),
                ValidateIssuer = false,
                ValidateAudience = false,
                RequireExpirationTime = false,
                ValidateLifetime = true,
                LifetimeValidator = (DateTime? notBefore, DateTime? expires, SecurityToken securityToken,
                                     TokenValidationParameters validationParameters) =>
                {
                    return notBefore <= DateTime.UtcNow &&
                           expires >= DateTime.UtcNow;
                }
            };

            services.AddSingleton(tokenValidationParameters);

            services.AddAuthorization(options =>
            {
                options.AddPolicy("UserViewer", builder => builder.RequireClaim("Users.view", "true"));
            });

            services.AddAuthentication(configureOptions: x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.SaveToken = true;
                x.TokenValidationParameters = tokenValidationParameters;
            });

            services.AddMvc(options =>
            {
                options.EnableEndpointRouting = false;
               // options.Filters.Add<ValidationFilter>();
            }).SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
                //.AddFluentValidation(mvcConfig => mvcConfig.RegisterValidatorsFromAssemblyContaining<Startup>())
                

            services.AddCors(options => options.AddPolicy("ApiCorsPolicy", builder =>
            {
                builder.WithOrigins("https://climb2gether.azurewebsites.net/").AllowAnyMethod().AllowAnyHeader();
                builder.WithOrigins("http://127.0.0.1:8080").AllowAnyMethod().AllowAnyHeader();
                builder.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader();
            }));

            services.AddHttpContextAccessor();

            services.AddSwaggerGen(x =>
            {
                x.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "climb2gether - backend", Version = "v1" });
                var security = new Dictionary<string, IEnumerable<string>>
                {
                    { "Bearer", new string [0]}
                };

                x.AddSecurityDefinition(name: "Bearer", new OpenApiSecurityScheme()
                {
                    Description = "JWT Authorization header using the bearer scheme",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey
                });
                x.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {new OpenApiSecurityScheme{Reference = new OpenApiReference
                    {
                        Id = "Bearer",
                        Type = ReferenceType.SecurityScheme
                    }}, new List<string>()}
                });
            });

            services.AddDbContext<DataContext>(options =>
                 options.UseSqlServer(
                     Configuration.GetConnectionString("DefaultConnection")));

            services.AddDefaultIdentity<User>(options => options.SignIn.RequireConfirmedAccount = true)
                    .AddRoles<IdentityRole<int>>()
                    .AddEntityFrameworkStores<DataContext>();

            services.AddScoped<IPostService, PostService>();
            services.AddScoped<IOfferService, OfferService>();
            services.AddScoped<IExpeditionsService, ExpeditionsService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<IRockSchemaService, RockSchemaService>();
            services.AddScoped<INotificationsService, NotificationsService>();
            services.AddScoped<IChatService, ChatService>();
            services.AddScoped<IUserService, UserService>();


            services.AddAutoMapper(typeof(Startup));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DataContext _dataContext)
        {
           // _dataContext.Database.EnsureCreated();
            _dataContext.Database.Migrate();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
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
