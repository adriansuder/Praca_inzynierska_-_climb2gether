using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Requests
{
    public class UserRegistrationRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public string Sex { get; set; }
        public string Surname { get; set; }
        public int RoleId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public string City { get; set; }
        public string? ActivationCode { get; set; }
    }
}
