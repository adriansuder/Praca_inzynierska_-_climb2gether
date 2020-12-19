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
        private readonly IIdentityService _identityService;

        public ChatService(DataContext dataContext, IMapper mapper, IIdentityService identityService)
        {
            _dataContext = dataContext;
            _mapper = mapper;
            _identityService = identityService;
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
                                                    .Include(x => x.Messages)
                                                    .Select( x => new ConversationResponse
                                                    {
                                                          Id = x.Id,
                                                          User1Id = userId,
                                                          User2Id = x.User2Id == userId ? x.User1Id : x.User2Id,
                                                          CreationDate = x.CreationDate,
                                                          LastEventDate = x.LastEventDate,
                                                          User2Email = null,
                                                          lastMessageText = x.Messages.Where( m => m.ConversationId == x.Id).OrderByDescending(m => m.Id).Select(m => m.Text).FirstOrDefault(),
                                                          haveUnreadedMessages = x.Messages.Where(m => m.ConversationId == x.Id && ((m.UserId == (x.User2Id == userId ? x.User1Id : x.User2Id))&& m.IsReaded == false )  )
                                                                                            .OrderByDescending(m => m.CreationDate)
                                                                                            .Select(m => m.Text).Any()
                                                    })
                                                    .ToListAsync();

            foreach(var obj in conversations)
            {
                obj.User2Email = await _identityService.GetUserEmailById(obj.User2Id);
            }
            return conversations;
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

        public async Task<bool> SetMessagesReaded(int conversationId, int userId)
        {
            var messagesToUpdate = await _dataContext.Messages.Where(m => m.ConversationId == conversationId && m.UserId != userId).ToListAsync();
            foreach(var msg in messagesToUpdate)
            {
                msg.IsReaded = true;
                _dataContext.Messages.Update(msg);
            }

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
