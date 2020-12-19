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
            var path = await _fileService.GetAttatchment(id);
            string type = "";
            byte[] b = new byte[] { };
            try
            {
                type = Path.GetExtension(path);
                b = System.IO.File.ReadAllBytes(path);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            if(b.Length <= 0)
            {
                return NoContent();
            }

            return Ok($"data:image/{type};base64," + Convert.ToBase64String(b));
            //Stream stream = System.IO.File.OpenRead(path);

            //if (stream == null)
            //    return NotFound(); 

            //return File(stream, "application/octet-stream"); 
        }


    }

}