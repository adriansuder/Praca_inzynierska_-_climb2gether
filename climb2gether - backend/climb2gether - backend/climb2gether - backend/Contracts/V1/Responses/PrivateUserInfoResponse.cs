using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Responses
{
    public class PrivateUserInfoResponse
    {   
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Sex { get; set; }
        public string RoleName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Phone { get; set; }
        public string City { get; set; }
    }
}
