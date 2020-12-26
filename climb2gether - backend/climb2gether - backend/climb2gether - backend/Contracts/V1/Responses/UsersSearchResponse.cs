using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Responses
{
    public class UsersSearchResponse
    {   
        public int Id { get; set; }
        public string NameAndSurname { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string RoleName { get; set; }

    }
}
