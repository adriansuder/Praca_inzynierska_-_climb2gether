using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Requests
{
    public class UpdatePostRequest
    {

        public string Subtitle { get; set; }
        public string ImgUrl { get; set; }
        public string Content { get; set; }
    }
}
