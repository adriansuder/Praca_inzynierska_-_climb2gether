﻿using climb2gether___backend.Contracts.V1.Requests;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public interface IFileService
    {
        Task<bool> AddAttatchments(List<IFormFile> objectFile, string objectTypeName, int objectTypeNumber);
        Task<bool> DeleteAttatchment(string objectTypeName, int objectTypeNumber);
    }
}
