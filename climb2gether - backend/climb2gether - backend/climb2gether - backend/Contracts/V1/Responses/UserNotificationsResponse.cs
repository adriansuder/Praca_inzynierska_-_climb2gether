using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Responses
{
    public class UserNotificationsResponse
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public bool IsReaded { get; set; }
        public int UserId { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
