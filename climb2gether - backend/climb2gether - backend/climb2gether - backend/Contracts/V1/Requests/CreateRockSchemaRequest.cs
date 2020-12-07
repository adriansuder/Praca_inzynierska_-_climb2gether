using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Requests
{
    public class CreateRockSchemaRequest
    {
        public int UserId { get; set; }
        public string RouteName { get; set; }
        public string RouteScale { get; set; }
        public string RouteDescription { get; set; }
        public string RouteLocation { get; set; }
        public bool IsPublic { get; set; }
        public List<IFormFile> Img { get; set; }
    }
}
