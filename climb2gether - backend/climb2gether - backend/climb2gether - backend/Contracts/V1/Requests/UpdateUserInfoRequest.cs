using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Requests
{
    public class UpdateUserInfoRequest
    {
        public string Phone { get; set; }
        public string City { get; set; }
        public string OldPassword { get; set; }
        public string Password { get; set; }
        public IFormFile Img { get; set; }
        public string UserPhotoStatus { get; set; }
    }
}
