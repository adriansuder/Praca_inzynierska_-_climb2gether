using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Domain
{
    public class UserRole
    {
        [Key]
        public string RoleId { get; set; }
        public string RoleName { get; set; }
        public bool isAdmin { get; set; }
    }
}
