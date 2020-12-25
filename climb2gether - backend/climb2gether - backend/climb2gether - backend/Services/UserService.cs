using AutoMapper;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public class UserService : IUserService
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;
        private readonly IIdentityService _identityService;

        public UserService(DataContext dataContext, IMapper mapper, IIdentityService identityService)
        {
            _dataContext = dataContext;
            _mapper = mapper;
            _identityService = identityService;
        }

        public async Task<PrivateUserInfoResponse> GetPrivateUserInfo(int userId)
        {
            var user = await _dataContext.Users.Where(u => u.Id == userId).FirstOrDefaultAsync();
            var response = _mapper.Map<PrivateUserInfoResponse>(user);
            response.RoleName = await _dataContext.ApplicationUserRoles.Where(r => r.RoleId == user.RoleId).Select(r => r.RoleName).SingleOrDefaultAsync();

            return response;
        }
    }
}
