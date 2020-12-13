﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Domain
{
    public class Conversation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int User1Id { get; set; }
        public virtual User User1 { get; set; }
        public int User2Id { get; set; }
        public virtual User User2 { get; set; }
        public DateTime CreationDate { get; set; }
        public ICollection<Message> Messages { get; set; }
    }
}
