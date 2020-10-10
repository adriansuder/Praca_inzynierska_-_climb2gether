using climb2gether___backend.Domain;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Responses
{
    public class UserResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Username { get; set; }
        public string Sex { get; set; }
        public int RoleId { get; set; }
        public UserRole Role { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public string IdentityUserId { get; set; }
        public IdentityUser IdentityUser { get; set; }
    }
}
