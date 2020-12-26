using AutoMapper;
using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Data;
using Microsoft.AspNetCore.Http;
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
        private readonly IFileService _fileService;

        public UserService(DataContext dataContext, IMapper mapper, IIdentityService identityService, IFileService fileService)
        {
            _dataContext = dataContext;
            _mapper = mapper;
            _identityService = identityService;
            _fileService = fileService;
        }

        public async Task<PrivateUserInfoResponse> GetPrivateUserInfo(int userId)
        {
            var user = await _dataContext.Users.Where(u => u.Id == userId).FirstOrDefaultAsync();
            var response = _mapper.Map<PrivateUserInfoResponse>(user);
            response.Img = await _dataContext.Attatchments.Where(a => a.ObjectTypeName == "profil" && a.ObjectTypeNumber == user.Id).Select(a => a.Id.ToString()).FirstOrDefaultAsync();
            response.RoleName = await _dataContext.ApplicationUserRoles.Where(r => r.RoleId == user.RoleId).Select(r => r.RoleName).SingleOrDefaultAsync();

            return response;
        }

        public async Task<bool> UpdateUserInfo(UpdateUserInfoRequest request, int userId)
        {
            var result = 0;
            var user = await _dataContext.Users.Where(u => u.Id == userId).SingleOrDefaultAsync();
            user.City = request.City;
            user.Phone = request.Phone;
            List<IFormFile> files = new List<IFormFile>();
            if (request.UserPhotoStatus != null)
            {
                var isAdded = await _fileService.CheckIfAnyExists("profil", user.Id);
                if (isAdded)
                {

                    if (request.UserPhotoStatus == "update")
                    {
                        files.Add(request.Img);
                        var temp = await _fileService.UpdateAttatchments(files, "profil", user.Id);
                        if (temp)
                        {
                            result++;
                        }
                    }else if(request.UserPhotoStatus == "delete")
                    {
                        var temp = await _fileService.DeleteAttatchment("profil", user.Id);
                        if (temp)
                        {
                            result++;
                        }
                    }

                }
                else if (!isAdded)
                {
                    files.Add(request.Img);

                    await _fileService.AddAttatchments(files, "profil", user.Id);
                }
            }
            _dataContext.Users.Update(user);
            result += await _dataContext.SaveChangesAsync();
            if (result == 0)
            {
                return false;
            }

            if (request.OldPassword != null && request.OldPassword != "")
            {
                var passwordchanged = await _identityService.ChangeUserPassword(userId, request.OldPassword, request.Password);
                if (passwordchanged)
                {
                    result++;
                }

            }

            return result > 0;

        }

        public async Task<List<UsersSearchResponse>> UsersSearch(string queryString)
        {
            var temp = queryString.Trim();
            var result = await  _dataContext.Users.Where(u => u.UserName.Contains(temp) || u.Email.Contains(temp)
                                                       || (u.FirstName + " " + u.Surname).Contains(temp)
                                                    ).Select(u => new UsersSearchResponse
                                                    {
                                                        Id = u.Id,
                                                        NameAndSurname = (u.FirstName + " " + u.Surname),
                                                        Username = u.UserName,
                                                        Email = u.Email,
                                                        RoleName =  _dataContext.ApplicationUserRoles.Where(r => r.RoleId == u.RoleId).Select(r => r.RoleName).FirstOrDefault()
                                                    }).ToListAsync();
            return result;
        }
    }
}
