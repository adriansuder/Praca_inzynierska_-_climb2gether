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
        public double Grade { get; set; }
        public IEnumerable<OfferResponseItem> Offers { get; set; }
       // public string[] ImgPathArray { get; set; }
    }

    public class OfferResponseItem
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
        public int UserEnrollmentId { get; set; }
        public List<Attatchment> Attatchments { get; set; }

    }
}
