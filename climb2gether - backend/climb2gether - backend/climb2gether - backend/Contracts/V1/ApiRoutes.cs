using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts
{
    public static class ApiRoutes
    {
        public const string Root = "api";
        public const string Version = "v1";
        public const string Base = Root + "/" + Version;

        public static class Posts
        {
            public const string GetAll = Base + "/posts";
            public const string Get = Base + "/posts/{postId}";
            public const string Create = Base + "/posts";
            public const string Update = Base + "/posts/{postId}";
            public const string Delete = Base + "/posts/{postId}";
            public const string Like = Base + "/posts/like";
            public const string Unlike = Base + "/posts/unlike";
        }

        public static class Identity
        {
            public const string Login = Base + "/login";
            public const string Register = Base + "/register";
            public const string RefreshToken = Base + "/refreshToken";
            public const string Logout = Base + "/logout";
        }

        public static class Users
        {
            public const string GetAll = Base + "/users";
            public const string UserRoles = Base + "/userRoles";
        }

        public static class Offers
        {
            public const string Create = Base + "/offers";
            public const string Delete = Base + "/offers/{offerId}";
            public const string GetAll = Base + "/offers";
            public const string Get = Base + "/offers/{offerId}";
            public const string GetUserOffers = Base + "/offers/user/{userId}";
            public const string GetOfferDetails = Base + "/offers/details";
            public const string Update = Base + "/offers";
            public const string CreateEnrollment = Base + "/offers/addEnrollment";
            public const string DeleteEnrollment = Base + "/offers/deleteEnrollment";
            public const string ParticipantsList = Base + "/offers/ParticipantsList";
            public const string GetUserOfferById = Base + "/offer/{offerId}";
        }
        public static class Expeditions
        {
            public const string Create = Base + "/expeditions";
            public const string GetAll = Base + "/expeditions";
            public const string CreateEnrollment = Base + "/expeditions/addEnrollment";
        }

        public static class RockSchema
        {
            public const string Create = Base + "/rockSchemas";
            public const string GetAllUsersSchemas = Base + "/rockSchemas/{userId}";
            public const string Delete = Base + "/rockSchemas/{schemaId}";
            public const string GetSchemaDetailsById = Base +  "/rockSchemas/{schemaId}/details";
        }

        public static class Notifications
        {
            public const string GetAll = Base + "/notifications";
            public const string Readed = Base + "/notifications/readed";
        }

        public static class Chat
        {
            public const string CreateOrFind = Base + "/conversations";
            public const string DeleteConversation = Base + "/conversation";
            public const string SendMessage = Base + "/sendMessage"; 
            public const string GetConversations = Base + "/conversations";
            public const string GetMessages = Base + "/messages/{conversationId}";
        }

        public static class File
        {
            public const string GetAttatchment = Base + "/attatchment/{id}";
        }
    }
    
}
