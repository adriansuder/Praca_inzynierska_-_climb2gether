using climb2gether___backend.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Responses
{
    public class UserOffersResponse
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Location { get; set; }
        public int MaxParticipants { get; set; }
        public double Price { get; set; }
        public string Describe { get; set; }
        public string OfferType { get; set; }
        public DateTime CreationDate { get; set; }
        public int OfferOwnerUserId { get; set; }
        public List<Attatchment> Attatchments { get; set; }

    }
}
