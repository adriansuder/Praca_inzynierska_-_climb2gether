using AutoMapper;
using climb2gether___backend.Contracts;
using climb2gether___backend.Contracts.V1.Requests;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Controllers.V1
{
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatController : Controller
    {
        private readonly IChatService _chatService;
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ChatController(IChatService chatService, IMapper mapper, IIdentityService identityService, IHttpContextAccessor httpContextAccessor)
        {
            _chatService = chatService;
            _mapper = mapper;
            _identityService = identityService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost(ApiRoutes.Chat.CreateOrFind)]
        public async Task<IActionResult> CreateOrFind([FromBody] NewConversationRequest request)
        {
            var userId = _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);
            if (userId == request.User2Id)
            {
                return BadRequest("Nie można utworzyć konwersacji z samym sobą");
            }
            var isConversationExists = await _chatService.checkIfConversationExists(userId, request.User2Id);
            if(isConversationExists > 0)
            {
                return Ok(new NewConversationResponse { 
                    Id = isConversationExists,
                    isNewConversation = false
                });
            }

            var conversationId = await _chatService.createNewConversation(userId, request.User2Id);

            if(conversationId == 0)
            {
                return BadRequest("Coś poszło nie tak");
            }

            return Ok(new NewConversationResponse
            {
                Id = conversationId,
                isNewConversation = true
            });
        }

        [HttpGet(ApiRoutes.Chat.GetConversations)]
        public async Task<IActionResult> GetConversations()
        {
            var userId =  _identityService.GetUserIdFromRequest(_httpContextAccessor.HttpContext);
            var conversations = await _chatService.GetAllConversations(userId);
            if(conversations.Count <= 0)
            {
                return NoContent();
            }

            return Ok(conversations);
        }


    }
}
