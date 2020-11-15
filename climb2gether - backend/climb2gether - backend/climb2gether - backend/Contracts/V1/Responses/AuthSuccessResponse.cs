using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Responses
{
    public class AuthSuccessResponse
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        //public bool Success { get; set; }
        public int UserId { get; set; }
        public DateTime ExpiresIn { get; set; }
    }
}
