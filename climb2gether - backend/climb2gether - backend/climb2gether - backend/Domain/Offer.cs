using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Domain
{
    public class Offer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Location { get; set; }
        public int MaxParticipants { get; set; }
        public double Price { get; set; }
        public string Describe { get; set; }
        public string OfferType { get; set; }
        public DateTime CreationDate { get; set; }
        [ForeignKey("User")]
        public int OfferOwnerUserId { get; set; }
        public User User { get; set; }
    }
}
