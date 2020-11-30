using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Requests
{
    public class AddExpeditionEnrollmentRequest
    {
        public int ParticipantUserId { get; set; }
        public int ExpeditionId { get; set; }
    }
}
