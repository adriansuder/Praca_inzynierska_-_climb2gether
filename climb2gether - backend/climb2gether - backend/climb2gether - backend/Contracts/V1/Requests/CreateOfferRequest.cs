using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Requests
{
    public class CreateOfferRequest
    {
        public DateTime Date { get; set; }
        public string Location { get; set; }
        public int MaxParticipants { get; set; }
        public double Price { get; set; }
        public string Describe { get; set; }
        public string OfferType { get; set; }
        public int OfferOwnerUserId { get; set; }
    }
}
