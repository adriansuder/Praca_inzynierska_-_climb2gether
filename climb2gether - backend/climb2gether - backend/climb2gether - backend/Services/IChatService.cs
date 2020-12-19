using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Contracts.V1.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public interface IChatService
    {
        Task<int> CheckIfConversationExists(int user1Id, int user2Id);
        Task<int> CreateNewConversation(int user1Id, int user2Id);
        Task<List<ConversationResponse>> GetAllConversations(int userId);
        Task<bool> UpdateLastModificationDate(int conversationId);
        Task<bool> SendMessage(SendMessageRequest request);
        Task<bool> CheckIfUserIsInConversation(int userId, int conversationId);
        Task<List<MessageResponse>> GetMessages(int conversationId);
        Task<bool> SetMessagesReaded(int conversationId, int userId);
    }
}
