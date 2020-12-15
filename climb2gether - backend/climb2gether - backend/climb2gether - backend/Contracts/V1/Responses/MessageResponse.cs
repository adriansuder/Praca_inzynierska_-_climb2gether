using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Responses
{
    public class MessageResponse
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime CreationDate { get; set; }
        public bool IsReaded { get; set; }
        public int ConversationId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
    }
}
