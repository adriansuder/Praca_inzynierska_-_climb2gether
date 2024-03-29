﻿using AutoMapper;
using climb2gether___backend.Contracts.V1.Responses;
using climb2gether___backend.Domain;
using Swashbuckle.Swagger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.AutoMapper
{
    public class DomainToResponseMapper : Profile
    {
        public DomainToResponseMapper()
        {
            CreateMap<Post, PostResponse>();
            CreateMap<User, UserResponse>();
            CreateMap<ApplicationUserRole, UserRoleResponse>();
            CreateMap<Expedition, ExpeditionResponse>();
            CreateMap<Notification, UserNotificationsResponse>();
            CreateMap<Conversation, ConversationResponse>();
            CreateMap<User, PrivateUserInfoResponse>();
        }
    }
}
