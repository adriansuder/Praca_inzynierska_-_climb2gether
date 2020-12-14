using climb2gether___backend.Contracts.V1.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public interface IChatService
    {
        Task<int> checkIfConversationExists(int user1Id, int user2Id);
        Task<int> createNewConversation(int user1Id, int user2Id);
        Task<List<ConversationResponse>> GetAllConversations(int userId);
    }
}
