using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using climb2gether___backend.Contracts;
using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace climb2gether___backend.Controllers.V1
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserController : Controller
    {
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserService _userService;

        public UserController( IMapper mapper, IIdentityService identityService, IHttpContextAccessor httpContextAccessor, IUserService userService)
        {
            _mapper = mapper;
            _identityService = identityService;
            _httpContextAccessor = httpContextAccessor;
            _userService = userService;
        }

        [HttpGet(ApiRoutes.User.GetPrivateUserInfo)]
        public async Task<IActionResult> GetPrivateUserInfo([FromQuery] string? userId)
        {
            var user = userId != null ? Int32.Parse(userId) : _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);
            var response = await _userService.GetPrivateUserInfo(user);
            return Ok(response);
        }

        [HttpPut(ApiRoutes.User.UpdateUserInfo)]
        public async Task<IActionResult> UpdateUserInfo([FromForm] UpdateUserInfoRequest request)
        {
            var userId = _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);
            var result = await _userService.UpdateUserInfo(request, userId);

            return Ok(result);
        }

        [HttpGet(ApiRoutes.User.UsersSearch)]
        public async Task<IActionResult> UsersSearch([FromQuery] string queryString)
        {   
            if(queryString == null || queryString == "" || queryString==" ")
            {
                return NoContent();
            }
            var response = await _userService.UsersSearch(queryString);
            return Ok(response);
        }

        [HttpPost(ApiRoutes.User.CreateReview)]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewRequest reviewRequest)
        {
            var userId = _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);
            var result = await _userService.CreateReview(userId, reviewRequest);
            return Ok(result);
        }

        [HttpDelete(ApiRoutes.User.DeleteReview)]
        public async Task<IActionResult> DeleteReview([FromQuery] int reviewId)
        {
            var userId = _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);
            var result = await _userService.DeleteReview(userId, reviewId);
            return Ok(result);
        }

        [HttpGet(ApiRoutes.User.GetUsersReviews)]
        public async Task<IActionResult> GetUsersReviews([FromQuery] int userId)
        {
            var result = await _userService.GetUsersReviews(userId);
            return Ok(result);
        }
    }
}