using AutoMapper;
using climb2gether___backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using climb2gether___backend.Contracts;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Domain;
using System.Collections.Generic;

namespace climb2gether___backend.Controllers.V1
{
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class NotificationController : Controller
    {
        private readonly INotificationsService _notificationsService;
        private readonly IIdentityService _identityService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;


        public NotificationController(INotificationsService notificationsService, IMapper mapper, IIdentityService identityService, IHttpContextAccessor httpContextAccessor)
        {
            _notificationsService = notificationsService;
            _mapper = mapper;
            _identityService = identityService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet(ApiRoutes.Notifications.GetAll)]
        public async Task<IActionResult> GetAll()
        {
            //var userId = _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);
            var result = await _notificationsService.GetNotifications(1);
            if (result.Count <= 0)
            {
                return NoContent();
            }

            return Ok(result);

        }
    }
}