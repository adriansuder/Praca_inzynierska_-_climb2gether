using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using climb2gether___backend.Contracts;
using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Domain;
using climb2gether___backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace climb2gether___backend.Controllers.V1
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ExpeditionsController : Controller
    {
        private readonly IExpeditionsService _expeditionsService;
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ExpeditionsController(IExpeditionsService expeditionsService, IMapper mapper, IIdentityService identityService, IHttpContextAccessor httpContextAccessor)
        {
            _expeditionsService = expeditionsService;
            _mapper = mapper;
            _identityService = identityService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost(ApiRoutes.Expeditions.Create)]
        public async Task<IActionResult> Create([FromBody] CreateExpeditionRequest request )
        {

            var expedition = _mapper.Map<Expedition>(request);
            var result = await _expeditionsService.CreateExpeditionAsync(expedition);
            if (!result)
            {
                return BadRequest();
            }

            return Ok(result);
        }

        [HttpGet(ApiRoutes.Expeditions.GetAll)]
        public async Task<IActionResult> GetAll()
        {
            var userId = _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);
            var result = await _expeditionsService.GetExpeditionsAsync(userId);
            return Ok(result);
        }

        [HttpPost(ApiRoutes.Expeditions.CreateEnrollment)]
        public async Task<IActionResult> CreateEnrollment([FromBody] AddExpeditionEnrollmentRequest request)
        {
            var expedition = _mapper.Map<ExpeditionEnrollment>(request);
            var isUserAlreadyEnrolled = await _expeditionsService.CheckIfUserIsAlreadyEnrolled(expedition);

            if (isUserAlreadyEnrolled)
            {
                return BadRequest("User is already Enrolled");
            }

            var result = await _expeditionsService.CreateEnrollmentAsync(expedition);
            if (!result)
            {
                return BadRequest("Sth went wrong");
            }

            return Ok(result);
        }

        [HttpGet(ApiRoutes.Expeditions.ExpeditionSearch)]
        public async Task<IActionResult> ExpeditionSearch([FromQuery] string queryRequest)
        {   
            var result = await _expeditionsService.SearchExpeditions(queryRequest);


            return Ok(result);
        }

        [HttpGet(ApiRoutes.Expeditions.GetUserExpeditions)]
        public async Task<IActionResult> GetUserExpeditions()
        {
            var userId = _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);
            var result = await _expeditionsService.GetUserExpeditions(userId);


            return Ok(result);
        }

        [HttpDelete(ApiRoutes.Expeditions.DeleteExpedition)]
        public async Task<IActionResult> DeleteExpedition([FromQuery] int expId)
        {
            var userId = _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);
            var isExpeditionOwner = _expeditionsService.CheckIsExpeditionOwner(userId, expId);
            if (!isExpeditionOwner)
            {
                return BadRequest("Nie masz praw do edycji tej wyprawy.");
            }
            var deleted = await _expeditionsService.DeleteExpedition(expId);
            if (!deleted)
            {
                return BadRequest("Coś poszło nie tak");
            }

            return Ok(new { Message = "Oferta zostałą usunięta."});
        }

        [HttpDelete(ApiRoutes.Expeditions.DeleteExpeditionEnrollment)]
        public async Task<IActionResult> DeleteExpeditionEnrollment([FromQuery] int expEnrollmentId)
        {
            var userId = _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);
            var deleted = await _expeditionsService.DeleteExpeditionEnrollment(expEnrollmentId, userId);
            if (!deleted)
            {
                return BadRequest("Coś poszło nie tak");
            }

            return Ok(new { Message = "Twoje zgłoszenie zostało usunięte." });
        }
    }
}