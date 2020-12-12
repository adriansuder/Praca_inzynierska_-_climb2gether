using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Domain
{
    public class Notification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Message { get; set; }
        public bool IsReaded { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTime CreationDate { get; set; }

    }
}
