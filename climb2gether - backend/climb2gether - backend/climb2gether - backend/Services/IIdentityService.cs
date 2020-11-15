using climb2gether___backend.Domain;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public interface IIdentityService
    {
        Task<AuthenticationResult> RegisterAsync(string email, string password, string username, string name, string surname, DateTime dateOfBirth, string sex, Guid roleId, string phoneNumber);
        Task<AuthenticationResult> LoginAsync(string username, string password);
        Task<AuthenticationResult> RefreshTokenAsync(string token, string refreshToken);
        Task<bool> LogoutAsync(string refreshToken);
        Task<List<User>> GetUsersAsync();
        Task<List<UserRole>> GetAllRolesAsync();

    }   
}
