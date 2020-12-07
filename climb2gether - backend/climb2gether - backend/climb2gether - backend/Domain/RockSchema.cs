using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace climb2gether___backend.Domain
{
    public class RockSchema
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }
        public string RouteName { get; set; }
        public string RouteScale { get; set; }
        public string RouteDescription { get; set; }
        public string RouteLocation { get; set; }
        public DateTime CreationDate { get; set; }
        public bool IsPublic { get; set; }

    }
}
