﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Domain
{
    public class Post
    {   
        [Key]
        public string PostId { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string ImgUrl { get; set; }
        public string Content { get; set; }
        public DateTime CreationDate { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }

        public User User { get; set; }
    }
}
