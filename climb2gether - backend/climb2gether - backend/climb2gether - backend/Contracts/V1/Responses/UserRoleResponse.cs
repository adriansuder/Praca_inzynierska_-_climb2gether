using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Responses
{
    public class UserRoleResponse
    {
        public string Id { get; set; }
        public string RoleName { get; set; }
        public bool isAdmin { get; set; }
    }
}
