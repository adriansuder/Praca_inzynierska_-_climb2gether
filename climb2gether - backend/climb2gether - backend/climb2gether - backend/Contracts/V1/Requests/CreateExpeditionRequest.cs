using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Requests
{
    public class CreateExpeditionRequest
    {
        public int UserId { get; set; }
        public string DestinationCity { get; set; }
        public string Destination { get; set; }
        public string DestinationRegion { get; set; }
        public string DepartureCity { get; set; }
        public int MaxParticipants { get; set; }
        public DateTime ExpeditionDate { get; set; }
        public string DescriptionTitle { get; set; }
        public string Description { get; set; }
    }
}
