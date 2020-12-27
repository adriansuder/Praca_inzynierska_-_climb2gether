using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Requests
{
    public class CreateReviewRequest
    {
        public int Grade { get; set; }
        public int UserId { get; set; }
        public string Comment { get; set; }
    }
}
