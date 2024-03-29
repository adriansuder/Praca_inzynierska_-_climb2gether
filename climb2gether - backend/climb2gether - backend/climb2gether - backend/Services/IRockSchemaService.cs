﻿using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Contracts.V1.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public interface IRockSchemaService
    {
        Task<int> Create(CreateRockSchemaRequest request);
        Task<List<UserSchemasResponse>> GetAllUserSchemas(int userId, string routeName, string routeLocation, bool isPublic);
        Task<bool> IsOwner(int userId, int schemaId);
        Task<bool> Delete(int schemaId);
        Task<SchemaDetailsResponse> GetSchemaDetailsById(int schemaId, int userId);
    }
}
