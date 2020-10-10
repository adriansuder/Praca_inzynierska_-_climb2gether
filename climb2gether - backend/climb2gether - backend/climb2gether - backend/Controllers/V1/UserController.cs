using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using climb2gether___backend.Contracts;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace climb2gether___backend.Controllers.V1
{
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "SuperAdmin, Admin")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        //[Authorize(Policy = "UserViewer")]
        [HttpGet(ApiRoutes.Users.GetAll)]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetUsersAsync();
            return Ok(_mapper.Map<List<UserResponse>>(users));
        }
        [AllowAnonymous]
        [HttpGet(ApiRoutes.Users.UserRoles)]
        public async Task<IActionResult> GetAllUserRoles()
        {
            var userRoles = await _userService.GetAllRolesAsync();
            return Ok(_mapper.Map<List<UserRoleResponse>>(userRoles));
        }
    }
}