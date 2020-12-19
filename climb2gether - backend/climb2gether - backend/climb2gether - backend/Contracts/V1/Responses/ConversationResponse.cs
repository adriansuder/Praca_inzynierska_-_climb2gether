using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Responses
{
    public class ConversationResponse
    {
        public int Id { get; set; }
        public int User1Id { get; set; }
        public int User2Id { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastEventDate { get; set; }
        public string User2Email { get; set; }
        public string lastMessageText { get; set; }
        public bool haveUnreadedMessages { get; set; }
    }
}
