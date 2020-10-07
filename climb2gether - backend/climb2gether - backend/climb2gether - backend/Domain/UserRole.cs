using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Domain
{
    public class UserRole
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public bool isAdmin { get; set; }
    }
}
