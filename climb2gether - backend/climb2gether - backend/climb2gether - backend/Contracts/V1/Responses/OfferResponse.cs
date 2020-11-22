using climb2gether___backend.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Responses
{
    public class OfferResponse
    {
        public string UserNameSurname { get; set; }
        public string userRole { get; set; }
        public int UserId { get; set; }
        public IEnumerable<Offer> Offers { get; set; }

    }
}
