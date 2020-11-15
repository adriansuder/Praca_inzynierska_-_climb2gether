using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Domain
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Login { get; set; }
        public string Sex { get; set; }
        public string RoleId { get; set; }
        [ForeignKey(nameof(RoleId))]
        public UserRole Role { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Phone { get; set; }
       // public string IdentityUserId { get; set; }
       // [ForeignKey(nameof(IdentityUserId))]
       // public IdentityUser IdentityUser { get; set; }
        //public Guid PostId { get; set; }
        //public Post Post { get; set; }

    }
}
