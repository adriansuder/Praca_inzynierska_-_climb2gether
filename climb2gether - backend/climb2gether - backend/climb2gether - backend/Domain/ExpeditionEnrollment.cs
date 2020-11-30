using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Domain
{
    public class ExpeditionEnrollment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [ForeignKey("User")]
        public int ParticipantUserId { get; set; }
        public User User { get; set; }
        [ForeignKey("Expedition")]
        public int ExpeditionId { get; set; }
        public Expedition Expedition { get; set; }
    }
}
