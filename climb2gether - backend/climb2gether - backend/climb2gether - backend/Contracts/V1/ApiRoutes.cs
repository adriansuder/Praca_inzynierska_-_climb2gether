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
        }
    }
}
