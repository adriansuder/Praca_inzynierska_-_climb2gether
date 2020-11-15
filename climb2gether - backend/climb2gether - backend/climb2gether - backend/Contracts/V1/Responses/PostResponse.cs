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
        public string Id { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string ImgURL { get; set; }
        public string Content { get; set; }
        public string UserId { get; set; }
        public string UserNameSurname { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
