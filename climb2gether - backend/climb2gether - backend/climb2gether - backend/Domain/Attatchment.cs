using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace climb2gether___backend.Domain
{
    public class Attatchment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string FilePath { get; set; }
        public string ObjectTypeName { get; set; }
        public int ObjectTypeNumber { get; set; }
    }
}
