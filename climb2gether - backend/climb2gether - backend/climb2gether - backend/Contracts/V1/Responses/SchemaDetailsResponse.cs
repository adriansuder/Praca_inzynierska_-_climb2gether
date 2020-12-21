using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Responses
{
    public class SchemaDetailsResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string RouteName { get; set; }
        public string RouteScale { get; set; }
        public string RouteDescription { get; set; }
        public string RouteLocation { get; set; }
        public DateTime CreationDate { get; set; }
        public bool IsPublic { get; set; }
        public int? ImgID { get; set; }
    }
}
