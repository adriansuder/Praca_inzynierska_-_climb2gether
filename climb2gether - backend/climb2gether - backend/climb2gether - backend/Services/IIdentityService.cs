using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public interface IIdentityService
    {
        Task<AuthenticationResult> RegisterAsync(UserRegistrationRequest newUser);
        Task<AuthenticationResult> LoginAsync(string username, string password);
        Task<AuthenticationResult> RefreshTokenAsync(string token, string refreshToken);
        Task<bool> LogoutAsync(string refreshToken);
        Task<List<User>> GetUsersAsync();
        Task<List<ApplicationUserRole>> GetAllRolesAsync();
        int GetUserIdFromJWT(string token);
        int GetUserIdFromRequest(HttpContext ctx);

    }   
}
