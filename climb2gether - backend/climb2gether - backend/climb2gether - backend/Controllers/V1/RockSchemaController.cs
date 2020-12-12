using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using climb2gether___backend.Contracts;
using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.Swagger;

namespace climb2gether___backend.Controllers.V1
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class RockSchemaController : Controller
    {
        
        private readonly IRockSchemaService _rockSchemaService;
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;
        private readonly IFileService _fileService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RockSchemaController(IRockSchemaService rockSchemaService, IMapper mapper, IIdentityService identityService, IFileService fileService, IHttpContextAccessor httpContextAccessor)
        {
            _rockSchemaService = rockSchemaService;
            _mapper = mapper;
            _identityService = identityService;
            _fileService = fileService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost(ApiRoutes.RockSchema.Create)]
        public async Task<IActionResult> Create([FromForm] CreateRockSchemaRequest request)
        {
            List<IFormFile> files = request.Img;

            var rockSchemaId = await _rockSchemaService.Create(request);
            await _fileService.AddAttatchments(files, "schemat", rockSchemaId);

            //var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host.ToUriComponent()}";
            //var locationUri = baseUrl + "/" + ApiRoutes.Posts.Get.Replace("{postId}", post.Id.ToString());

            return Ok(rockSchemaId);
        }

        [HttpGet(ApiRoutes.RockSchema.GetAllUsersSchemas)]
        public async Task<IActionResult> GetAllUsersSchemas([FromRoute] int userId, [FromQuery] string routeName, [FromQuery] string routeLocation, [FromQuery] bool isPublic)
        {   
            List<UserSchemasResponse> schemasList = await _rockSchemaService.GetAllUserSchemas(userId, routeName??="", routeLocation??="", isPublic);
            if(schemasList.Count() <= 0)
            {
                return BadRequest("Brak pobranych schematow");
            }

            return Ok(schemasList);
        }

        [HttpDelete(ApiRoutes.RockSchema.Delete)]
        public async Task<IActionResult> DeleteSchema([FromRoute] int schemaId)
        {
            var userId = _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);
            var isOwner = await _rockSchemaService.IsOwner(1, schemaId);
            if (!isOwner)
            {
                return BadRequest("Użytkownik nie jest właścicielem schematu!");
            }
            await _fileService.DeleteAttatchment("schemat", schemaId);
            var result = await _rockSchemaService.Delete(schemaId);
            if (!result)
            {
                return BadRequest("Coś poszło nie tak!");
            }

            return Ok(result);
        }

    }
}