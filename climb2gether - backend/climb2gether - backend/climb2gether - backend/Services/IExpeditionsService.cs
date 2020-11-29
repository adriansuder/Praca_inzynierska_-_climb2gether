﻿using climb2gether___backend.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public interface IExpeditionsService
    {
        Task<bool> CreateExpeditionAsync(Expedition expedition);
        Task<List<Expedition>> GetExpeditionsAsync();
    }
}
