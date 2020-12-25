using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Data;
using climb2gether___backend.Domain;
using climb2gether___backend.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<User> _userManager;
        private readonly JwtSettings _jwtSettings;
        private readonly TokenValidationParameters _tokenValidationParameter;
        private readonly DataContext _dataContext;

        public readonly AuthenticationResult invalidToken = new AuthenticationResult { Errors = new[] { "Invalid jwt token" } };
        public IdentityService(UserManager<User> userManager, JwtSettings jwtSettings, DataContext dataContext, TokenValidationParameters tokenValidationParameters)
        {
            _userManager = userManager;
            _jwtSettings = jwtSettings;
            _dataContext = dataContext;
            _tokenValidationParameter = tokenValidationParameters;
        }

        public async Task<bool> LogoutAsync(string refreshToken)
        {
            var tokenToDelete = _dataContext.RefreshTokens
                                                .Where(x => x.Token == refreshToken)
                                                .FirstOrDefault();
            _dataContext.Remove(tokenToDelete);
            await _dataContext.SaveChangesAsync();

            return true;
        }

        public async Task<AuthenticationResult> LoginAsync(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "User does not exists" }
                };
            }

            var validUserPassword = await _userManager.CheckPasswordAsync(user, password);

            if (!validUserPassword)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "Not valid password" }
                };
            }

            return await GenerateAuthResultForUserAsync(user);
        }

        public int GetUserIdFromJWT(string JWT)
        {
            var validatedToken = GetPrincipalFromToken(JWT);
            int userId = Int32.Parse(validatedToken.Claims.Single(x => x.Type == "id").Value);

            return userId;
        }

        public async Task<AuthenticationResult> RegisterAsync(UserRegistrationRequest userRequest)
        {
            var existingUser = await _userManager.FindByEmailAsync(userRequest.Email);
            var existingLogin = await _userManager.FindByNameAsync(userRequest.UserName);
            if (existingUser != null || existingLogin != null)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "User with this email or login already exists" }
                };
            }

            var newUser = new User
            {  
                Email = userRequest.Email,
                FirstName = userRequest.FirstName,
                Surname = userRequest.Surname,
                UserName = userRequest.UserName,
                Sex = userRequest.Sex,
                RoleId = userRequest.RoleId,
                DateOfBirth = userRequest.DateOfBirth,
                Phone = userRequest.Phone,
                City = userRequest.City
        };

            var createdUser = await _userManager.CreateAsync(newUser, userRequest.Password);
           

            if (!createdUser.Succeeded)
            {
                return new AuthenticationResult
                {
                    Errors = createdUser.Errors.Select(x => x.Description)
                };
            }

            await _userManager.AddClaimAsync(newUser, new Claim("UserViewer", "true"));
            //await _userManager.AddToRoleAsync(newUser, "User");

            return await GenerateAuthResultForUserAsync(newUser);
        }

        private ClaimsPrincipal GetPrincipalFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var tokenValidationParameters = _tokenValidationParameter.Clone();
                tokenValidationParameters.ValidateLifetime = false;
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);
                if (!IsJwtValidSecurityAlgorithm(validatedToken))
                {
                    return null;
                }
                return principal;
            }
            catch(Exception e)
            {
                Console.WriteLine(e);
                return null; 
            }
        }

        private bool IsJwtValidSecurityAlgorithm(SecurityToken validatedToken)
        {
            return (validatedToken is JwtSecurityToken jwtSecurityToken) &&
                jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
                StringComparison.InvariantCultureIgnoreCase);
        }


        public async Task<AuthenticationResult> RefreshTokenAsync(string token, string refreshToken)
        {
            var validatedToken = GetPrincipalFromToken(token);

            if (validatedToken == null)
            {
                return new AuthenticationResult { Errors = new[] { "Invalid jwt token" } };
            }

            var expiryDateUnix = long.Parse(validatedToken.Claims.Single( x => x.Type == JwtRegisteredClaimNames.Exp).Value);
            var expiryDateTimeUtc = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddSeconds(expiryDateUnix);

            if(expiryDateTimeUtc > DateTime.UtcNow)
            {
                return new AuthenticationResult { Errors = new[] { "this token has not expired." } };
            }

            var jti = validatedToken.Claims.Single(x => x.Type == JwtRegisteredClaimNames.Jti).Value;

            var storedRefreshToken = await _dataContext.RefreshTokens.SingleOrDefaultAsync(x => x.Token == refreshToken);

            if(
                storedRefreshToken == null ||
                DateTime.UtcNow > storedRefreshToken.ExpiryDate ||
                storedRefreshToken.Invalidated ||
                storedRefreshToken.Used ||
                storedRefreshToken.JwtId != jti
                )
            {
                return this.invalidToken;
            }

            storedRefreshToken.Used = true;
            _dataContext.RefreshTokens.Update(storedRefreshToken);
            await _dataContext.SaveChangesAsync();

            var user = await _userManager.FindByIdAsync(validatedToken.Claims.Single(x => x.Type == "id").Value);
            return await GenerateAuthResultForUserAsync(user);
        }

        private async Task<AuthenticationResult> GenerateAuthResultForUserAsync(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);
            var claims = new List<Claim>
            {
                    new Claim(type: JwtRegisteredClaimNames.Sub, user.Email),
                    new Claim(type: JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(type: JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(type: "id", value: user.Id.ToString())
            };

            var userClaims = await _userManager.GetClaimsAsync(user);
            claims.AddRange(userClaims);
            DateTime utc = DateTime.UtcNow;
            TimeZoneInfo zone = TimeZoneInfo.FindSystemTimeZoneById(TimeZoneInfo.Local.Id); 
            DateTime localDateTime = TimeZoneInfo.ConvertTimeFromUtc(utc, zone);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = localDateTime.Add(_jwtSettings.TokenLifeTime),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var userId = await _userManager.FindByEmailAsync(user.Email);
            var refreshToken = new RefreshToken
            {
                JwtId = token.Id,
                UserId = userId.Id,
                CreationDate = DateTime.UtcNow,
                ExpiryDate = DateTime.UtcNow.AddMonths(6)
            };

            await _dataContext.RefreshTokens.AddAsync(refreshToken);
            await _dataContext.SaveChangesAsync();
            //var userId = await _dataContext.Users.Select
            return new AuthenticationResult
            {
                Success = true,
                Token = tokenHandler.WriteToken(token),
                RefreshToken = refreshToken.Token,
                ExpiresIn = DateTime.UtcNow.Add(_jwtSettings.TokenLifeTime),
                UserId = userId.Id
            };
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _dataContext.Users.ToListAsync();
        }

        public async Task<List<ApplicationUserRole>> GetAllRolesAsync()
        {
            return await _dataContext.ApplicationUserRoles.ToListAsync();
        }

        public int GetUserIdFromRequest(HttpContext ctx)
        {
            var userId = ctx.User.Claims.Single( x => x.Type == "id").Value;
            return Int32.Parse(userId);
        }

        public async Task<int> GetUserIdByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if(user == null)
            {
                return 0;
            }
            return user.Id;
        }

        public async Task<string> GetUserEmailById(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            return user.Email;
        }

        public async Task<bool> ChangeUserPassword(int userId, string currentPassword, string newPassword)
        {
            var user = _dataContext.Users.Where(u => u.Id == userId).SingleOrDefault();
            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            

            return result.Succeeded;
        }
    }
}
