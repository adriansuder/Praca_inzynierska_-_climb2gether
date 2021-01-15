using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using climb2gether___backend.Contracts;
using climb2gether___backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace climb2gether___backend.Controllers.V1
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class FileController : Controller
    {
        private readonly IFileService _fileService;
        private readonly IIdentityService _identityService;

        public FileController(IFileService fileService, IIdentityService identityService)
        {
            _fileService = fileService;
            _identityService = identityService;
        }


        [HttpGet(ApiRoutes.File.GetAttatchment)]
        public async Task<IActionResult> GetAttatchment([FromRoute] int id)
        {
            var blob = await _fileService.GetAttatchment(id);
            if (String.IsNullOrEmpty(blob))
            {
                return NoContent();
            }

            return Ok(blob);
        }


    }

}