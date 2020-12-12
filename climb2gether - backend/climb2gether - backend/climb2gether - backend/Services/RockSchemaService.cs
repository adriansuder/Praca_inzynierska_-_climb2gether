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

        public RockSchemaService(DataContext dataContext)
        {
            _dataContext = dataContext;
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
            var query = await (from schema in _dataContext.RockSchemas
                               where schema.UserId == userId && schema.IsPublic == isPublic
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
    }
}
