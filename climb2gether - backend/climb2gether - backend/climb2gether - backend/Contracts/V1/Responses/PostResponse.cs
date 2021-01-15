using climb2gether___backend.Domain;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Responses
{
    public class PostResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string ImgURL { get; set; }
        public string Content { get; set; }
        public int UserId { get; set; }
        public string UserNameSurname { get; set; }
        public DateTime CreationDate { get; set; }
        public int LikeCounter { get; set; }
        public bool PostLikedByLoggedUser { get; set; }
        public int LoggedUserPostLikeId { get; set; }
        public string? ImgBlob { get; set; }
    }
}
