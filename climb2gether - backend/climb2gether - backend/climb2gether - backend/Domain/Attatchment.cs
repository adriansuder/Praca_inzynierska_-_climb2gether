using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Domain
{
    public class Attatchment
    {
        [Key]
        public int Id { get; set; }
        public string FilePath { get; set; }
        public string ObjectTypeName { get; set; }
        public string ObjectTypeNumber { get; set; }
    }
}
