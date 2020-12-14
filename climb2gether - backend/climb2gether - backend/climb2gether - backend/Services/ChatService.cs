using AutoMapper;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Data;
using climb2gether___backend.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Services
{
    public class ChatService : IChatService
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;

        public ChatService(DataContext dataContext, IMapper mapper)
        {
            _dataContext = dataContext;
            _mapper = mapper;
        }
        public async Task<int> checkIfConversationExists(int user1Id, int user2Id)
        {
            var conversationId = await _dataContext.Conversations.Where(x => (x.User1Id == user1Id && x.User2Id == user2Id) || (x.User1Id == user2Id && x.User2Id == user1Id)).Select(x => x.Id).SingleOrDefaultAsync();
            if(conversationId <= 0 || conversationId == null)
            {
                return 0;
            }

            return conversationId;
        }

        public async Task<int> createNewConversation(int user1Id, int user2Id)
        {
            var conversation = new Conversation
            {
                User1Id = user1Id,
                User2Id = user2Id,
                CreationDate = DateTime.UtcNow,
                LastEventDate = DateTime.UtcNow
            };

            _dataContext.Conversations.Add(conversation);
            var result = await _dataContext.SaveChangesAsync();
            if(result <= 0)
            {
                return 0;
            }

            return conversation.Id;
        }

        public async Task<List<ConversationResponse>> GetAllConversations(int userId)
        {
            var conversations = await _dataContext.Conversations
                                                    .Where(x => (x.User1Id == userId || x.User2Id == userId))
                                                    .ToListAsync();
            return _mapper.Map<List<ConversationResponse>>(conversations);
        }
    }
}
