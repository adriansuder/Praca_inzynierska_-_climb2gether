using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Requests
{
    public class AddEnrollmentRequest
    {
        public int OfferId { get; set; }
        public int UserId { get; set; }
    }
}
