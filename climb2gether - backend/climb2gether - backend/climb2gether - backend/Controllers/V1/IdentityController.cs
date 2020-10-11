using AutoMapper;
using climb2gether___backend.Contracts;
using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Services;
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

        [HttpPost(template: ApiRoutes.Identity.Register)]
        public async Task <IActionResult> Register([FromBody] UserRegistrationRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = ModelState.Values.SelectMany(x => x.Errors.Select(xx => xx.ErrorMessage))
                });
            }

            var authResponse = await _identitySerivce.RegisterAsync(request.Email, request.Password, request.Username, request.Name, request.Surname, request.DateOfBirth, request.Sex, request.RoleId, request.PhoneNumber);

            if (!authResponse.Success)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = authResponse.Errors
                });
            }

            return Ok(new AuthSuccessResponse { 
                Token = authResponse.Token,
                //RefreshToken  = authResponse.RefreshToken
            });
        }

        [HttpPost(template: ApiRoutes.Identity.Login)]
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
                RefreshToken  = authResponse.RefreshToken
            });
        }

        [HttpPost(template: ApiRoutes.Identity.RefreshToken)]
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
                RefreshToken = null
            });
        }

        [HttpPost(template: ApiRoutes.Identity.Logout)]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
        {
             await _identitySerivce.LogoutAsync(request.RefreshToken);

            return Ok();
        }
    }
}
