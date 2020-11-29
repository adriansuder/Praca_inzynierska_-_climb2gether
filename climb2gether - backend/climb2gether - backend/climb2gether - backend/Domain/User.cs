using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Domain
{
    public class User : IdentityUser<int>
    {
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Sex { get; set; }
        [ForeignKey("Role")]
        public int RoleId { get; set; }
        public ApplicationUserRole Role { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Phone { get; set; }
        public string City { get; set; }

    }
}
