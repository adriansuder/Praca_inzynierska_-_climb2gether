using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Domain
{
    public class Expedition
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }
        public string DestinationCity { get; set; }
        public string Destination { get; set; }
        public string DestinationRegion { get; set; }
        public string DepartureCity { get; set; }
        public int MaxParticipants { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ExpeditionDate { get; set; }
        public string DescriptionTitle { get; set; }
        public string Description { get; set; }
    }
}
