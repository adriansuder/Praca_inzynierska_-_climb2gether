﻿using climb2gether___backend.Contracts.V1.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public interface IRockSchemaService
    {
        Task<int> Create(CreateRockSchemaRequest request);
    }
}