using climb2gether___backend.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Requests
{
    public class SendMessageRequest
    {
        public string Text { get; set; }
        public int ConversationId { get; set; }
        public int UserId { get; set; }
    }
}
