using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Contracts.V1.Responses
{
    public class ErrorModel
    {
        public string FieldName { get; set; }
        public string FriendlyMessage { get; set; }
    }
}
