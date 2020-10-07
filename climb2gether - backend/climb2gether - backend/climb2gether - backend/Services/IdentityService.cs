using climb2gether___backend.Data;
using climb2gether___backend.Domain;
using climb2gether___backend.Options;
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
        private readonly UserManager<IdentityUser> _userManager;
        private readonly JwtSettings _jwtSettings;
        private readonly TokenValidationParameters _tokenValidationParameter;
        private readonly DataContext _dataContext;

        public readonly AuthenticationResult invalidToken = new AuthenticationResult { Errors = new[] { "Invalid jwt token" } };
        public IdentityService(UserManager<IdentityUser> userManager, JwtSettings jwtSettings, DataContext dataContext)
        {
            _userManager = userManager;
            _jwtSettings = jwtSettings;
            _dataContext = dataContext;
        }

        private async Task<AuthenticationResult> GenerateAuthResultForUserAsync(IdentityUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims: new[] {
                    new Claim(type: JwtRegisteredClaimNames.Sub, user.Email),
                    new Claim(type: JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(type: JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(type: "id", value: user.Id)
                }),
                Expires = DateTime.UtcNow.Add(_jwtSettings.TokenLifeTime),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var refreshToken = new RefreshToken
            {
                JwtId = token.Id,
                UserId = user.Id,
                CreationDate = DateTime.UtcNow,
                ExpiryDate = DateTime.UtcNow.AddMonths(6)
            };

            await _dataContext.RefreshTokens.AddAsync(refreshToken);
            await _dataContext.SaveChangesAsync();

            return new AuthenticationResult
            {
                Success = true,
                Token = tokenHandler.WriteToken(token),
                RefreshToken = refreshToken.Token
            };
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

        public async Task<AuthenticationResult> RegisterAsync(string email, string password, string username, string name, string surname, DateTime dateOfBirth, string sex, int roleId, string phoneNumber)
        {
            var existingUser = await _userManager.FindByEmailAsync(email);

            if(existingUser != null)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "User with this email already exists" }
                };
            }

            var newUser = new IdentityUser
            {
                Email = email,
                UserName = username,
            };

            var createdUser = await _userManager.CreateAsync(newUser, password);
           

            if (!createdUser.Succeeded)
            {
                return new AuthenticationResult
                {
                    Errors = createdUser.Errors.Select(x => x.Description)
                };
            }

            var identityUser = await _userManager.FindByEmailAsync(email);

            User newAppUser = new User();
            newAppUser.IdentityUserId = identityUser.Id;
            newAppUser.Name = name;
            newAppUser.Surname = surname;
            newAppUser.Username = username;
            newAppUser.Sex = sex;
            newAppUser.RoleId = roleId;
            newAppUser.DateOfBirth = dateOfBirth;
            newAppUser.PhoneNumber = phoneNumber;
            _dataContext.Add(newAppUser);
            await _dataContext.SaveChangesAsync();

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
            catch
            {
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
    }
}
