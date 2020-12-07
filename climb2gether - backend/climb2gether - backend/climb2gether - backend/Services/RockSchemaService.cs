using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Data;
using climb2gether___backend.Domain;
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
    }
}
