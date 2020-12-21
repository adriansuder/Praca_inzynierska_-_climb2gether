using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Data;
using climb2gether___backend.Domain;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.Swagger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public class RockSchemaService : IRockSchemaService
    {
        private readonly DataContext _dataContext;
        private readonly IIdentityService _identityService;

        public RockSchemaService(DataContext dataContext, IIdentityService identityService)
        {
            _dataContext = dataContext;
            _identityService = identityService;
        }

        public async Task<int> Create(CreateRockSchemaRequest request)
        {
            var schema = new RockSchema
            {
                UserId = request.UserId,
                RouteName = request.RouteName,
                RouteScale = request.RouteScale,
                RouteDescription = request.RouteDescription,
                CreationDate = DateTime.UtcNow,
                IsPublic = request.IsPublic,
                RouteLocation = request.RouteLocation
            };

            await _dataContext.RockSchemas.AddAsync(schema);
            await _dataContext.SaveChangesAsync();

            return schema.Id;
            
        }

        public async Task<List<UserSchemasResponse>> GetAllUserSchemas(int userId, string routeName = "", string routeLocation = "", bool isPublic = false)
        {

            if (!isPublic)
            {
                var query = await (from schema in _dataContext.RockSchemas
                                   where schema.UserId == userId
                                        && (routeName == "" || schema.RouteName.Contains(routeName))
                                        && (routeLocation == "" || schema.RouteName.Contains(routeLocation))
                                   select new UserSchemasResponse
                                   {
                                       Id = schema.Id,
                                       UserId = schema.UserId,
                                       RouteName = schema.RouteName,
                                       RouteScale = schema.RouteScale,
                                       RouteDescription = schema.RouteDescription,
                                       RouteLocation = schema.RouteLocation,
                                       CreationDate = schema.CreationDate,
                                       IsPublic = schema.IsPublic,
                                       ImgURL = (from Attatchment in _dataContext.Attatchments where Attatchment.ObjectTypeNumber == schema.Id && Attatchment.ObjectTypeName == "schemat" select Attatchment.Id.ToString()).FirstOrDefault()
                                   }
              ).ToListAsync();


                return query;
            }
            else 
            {
                var query = await (from schema in _dataContext.RockSchemas
                                   where schema.IsPublic == true
                                        && (routeName == "" || schema.RouteName.Contains(routeName))
                                        && (routeLocation == "" || schema.RouteName.Contains(routeLocation))
                                   select new UserSchemasResponse
                                   {
                                       Id = schema.Id,
                                       UserId = schema.UserId,
                                       RouteName = schema.RouteName,
                                       RouteScale = schema.RouteScale,
                                       RouteDescription = schema.RouteDescription,
                                       RouteLocation = schema.RouteLocation,
                                       CreationDate = schema.CreationDate,
                                       IsPublic = schema.IsPublic,
                                       ImgURL = (from Attatchment in _dataContext.Attatchments where Attatchment.ObjectTypeNumber == schema.Id && Attatchment.ObjectTypeName == "schemat" select Attatchment.FilePath).FirstOrDefault()
                                   }
              ).ToListAsync();


                return query;
            }

        }

        public async Task<bool> IsOwner(int userId, int schemaId)
        {
            return await _dataContext.RockSchemas.Where(x => x.UserId == userId && x.Id == schemaId).AnyAsync();
        }

        public async Task<bool> Delete(int schemaId)
        {
            _dataContext.RockSchemas.Remove(await _dataContext.RockSchemas.Where(x => x.Id == schemaId).SingleOrDefaultAsync());
            var result = await _dataContext.SaveChangesAsync();
            return result > 0;
        }

        public async Task<SchemaDetailsResponse> GetSchemaDetailsById(int schemaId, int userId)
        {

            var result = await _dataContext.RockSchemas.Where(x => x.Id == schemaId).Select(x => new SchemaDetailsResponse
            {
                Id = x.Id,
                UserId = x.UserId,
                RouteName = x.RouteName,
                RouteScale = x.RouteScale,
                RouteDescription = x.RouteDescription,
                RouteLocation = x.RouteLocation,
                CreationDate = x.CreationDate,
                IsPublic = x.IsPublic,
                ImgID = null
            }).FirstOrDefaultAsync();

            if (!result.IsPublic)
            {
                var isOwner = await IsOwner(userId, schemaId);
                if (!isOwner)
                {
                    return null; 
                }
            }

            result.ImgID = await _dataContext.Attatchments.Where(s => s.ObjectTypeNumber == result.Id && s.ObjectTypeName == "schemat").Select(s => s.Id).FirstOrDefaultAsync();

            return result;
        }
    }
}
