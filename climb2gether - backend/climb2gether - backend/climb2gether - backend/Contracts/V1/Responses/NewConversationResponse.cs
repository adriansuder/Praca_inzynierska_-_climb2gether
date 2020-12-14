using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Responses
{
    public class NewConversationResponse
    {
        public int Id { get; set; }
        public bool isNewConversation { get; set; }
    }
}
