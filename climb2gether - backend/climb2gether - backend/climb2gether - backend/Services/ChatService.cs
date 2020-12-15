using AutoMapper;
using climb2gether___backend.Contracts.V1.Requests;
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
        public async Task<int> CheckIfConversationExists(int user1Id, int user2Id)
        {
            var conversationId = await _dataContext.Conversations.Where(x => (x.User1Id == user1Id && x.User2Id == user2Id) || (x.User1Id == user2Id && x.User2Id == user1Id)).Select(x => x.Id).SingleOrDefaultAsync();
            if(conversationId <= 0 || conversationId == null)
            {
                return 0;
            }

            return conversationId;
        }

        public async Task<bool> CheckIfUserIsInConversation(int userId, int conversationId)
        {
            var result = await _dataContext.Conversations.Where(x => x.Id == conversationId && (x.User1Id == userId || x.User2Id == userId)).AnyAsync();
            return result;
        }

        public async Task<int> CreateNewConversation(int user1Id, int user2Id)
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

        public Task<List<MessageResponse>> GetMessages(int conversationId)
        {
            var messagesList = _dataContext.Messages
                                            .Where(x => x.ConversationId == conversationId)
                                            .Include(x => x.User)
                                            .Select(x => new MessageResponse {
                                                Id  = x.Id,
                                                Text = x.Text,
                                                CreationDate = x.CreationDate,
                                                IsReaded = x.IsReaded,
                                                ConversationId = x.ConversationId,
                                                UserId = x.UserId,
                                                UserName = x.User.FirstName + " " + x.User.Surname
                                            })
                                            .ToListAsync();
            return messagesList;
        }

        public async Task<bool> SendMessage(SendMessageRequest request)
        {
            var message = _mapper.Map<Message>(request);
            _dataContext.Messages.Add(message);
            var result = await _dataContext.SaveChangesAsync();

            return result > 0;
        }

        public async Task<bool> UpdateLastModificationDate(int conversationId)
        {
            var conversation = await _dataContext.Conversations.Where(c => c.Id == conversationId).SingleOrDefaultAsync();
            conversation.LastEventDate = DateTime.UtcNow;
            var result = await _dataContext.SaveChangesAsync();

            return result == 1;
        }
    }
}
