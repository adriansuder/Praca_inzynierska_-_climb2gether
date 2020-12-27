using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Responses
{
    public class UserReviewsResponse
    {
        public int Id { get; set; }
        public int Grade { get; set; }
        public string Comment { get; set; }
        public int AuthorId { get; set; }
        public string AuthorNameSurname { get; set; }
        public int UserId { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
