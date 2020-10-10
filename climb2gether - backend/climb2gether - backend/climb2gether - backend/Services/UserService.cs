using climb2gether___backend.Data;
using climb2gether___backend.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
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
        private readonly UserManager<IdentityUser> _userManager;

        public UserService(DataContext dataContext, UserManager<IdentityUser> userManager)
        {
            _dataContext = dataContext;
            _userManager = userManager;
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _dataContext.Users.ToListAsync();
        }

        public async Task<List<UserRole>> GetAllRolesAsync()
        {
            return await _dataContext.UserRoles.ToListAsync();
        }
    }
}
