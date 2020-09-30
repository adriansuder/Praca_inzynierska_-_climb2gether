using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Requests
{
    public class UserLoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
