using AutoMapper;
using climb2gether___backend.Contracts;
using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Controllers.V1
{
    public class IdentityController : Controller
    {   
        private readonly IIdentityService _identitySerivce;
        private readonly IMapper _mapper;
        public IdentityController(IIdentityService identityService, IMapper mapper)
        {
            _identitySerivce = identityService;
            _mapper = mapper;
        }

        [HttpPost(ApiRoutes.Identity.Register)]
        public async Task <IActionResult> Register([FromBody] UserRegistrationRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = ModelState.Values.SelectMany(x => x.Errors.Select(xx => xx.ErrorMessage))
                });
            }
            
            var authResponse = await _identitySerivce.RegisterAsync(request);

            if (!authResponse.Success)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = authResponse.Errors
                });
            }

            return Ok(new AuthSuccessResponse
            {
                Token = authResponse.Token,
                RefreshToken = authResponse.RefreshToken,
                UserId = authResponse.UserId,
                ExpiresIn = TimeZoneInfo.ConvertTimeFromUtc(authResponse.ExpiresIn, TimeZoneInfo.FindSystemTimeZoneById(TimeZoneInfo.Local.Id))

            });
        }

        [HttpPost(ApiRoutes.Identity.Login)]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
        {
            var authResponse = await _identitySerivce.LoginAsync(request.Username, request.Password);

            if (!authResponse.Success)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = authResponse.Errors
                });
            }

            return Ok(new AuthSuccessResponse
            {
                Token = authResponse.Token,
                RefreshToken  = authResponse.RefreshToken,
                UserId = authResponse.UserId,
                ExpiresIn = TimeZoneInfo.ConvertTimeFromUtc(authResponse.ExpiresIn, TimeZoneInfo.FindSystemTimeZoneById(TimeZoneInfo.Local.Id))

            });
        }

        [HttpPost(ApiRoutes.Identity.RefreshToken)]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var authResponse = await _identitySerivce.RefreshTokenAsync(request.Token, request.RefreshToken);

            if (!authResponse.Success)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = authResponse.Errors
                });
            }

            return Ok(new AuthSuccessResponse
            {
                Token = authResponse.Token,
                RefreshToken = authResponse.RefreshToken,
                UserId = authResponse.UserId,
                ExpiresIn = TimeZoneInfo.ConvertTimeFromUtc(authResponse.ExpiresIn, TimeZoneInfo.FindSystemTimeZoneById(TimeZoneInfo.Local.Id))
            });
        }

        [HttpPost(ApiRoutes.Identity.Logout)]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
        {
             await _identitySerivce.LogoutAsync(request.RefreshToken);

            return Ok();
        }
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "SuperAdmin, Admin")]
        [HttpGet(ApiRoutes.Users.GetAll)]
        public async Task<IActionResult> GetAll()
        {
            var users = await _identitySerivce.GetUsersAsync();
            return Ok(_mapper.Map<List<UserResponse>>(users));
        }

        [HttpGet(ApiRoutes.Users.UserRoles)]
        public async Task<IActionResult> GetAllUserRoles()
        {
            var userRoles = await _identitySerivce.GetAllRolesAsync();
            return Ok(userRoles);
        }
    }
}
