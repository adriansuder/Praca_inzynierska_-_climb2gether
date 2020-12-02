using System;
using System.Collections.Generic;
using System.Text;
using climb2gether___backend.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace climb2gether___backend.Data
{
    public class DataContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public DbSet<Post> Posts { get; set; }
        public DbSet<PostLike> PostLikes { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<ApplicationUserRole> ApplicationUserRoles { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<OfferEnrollment> OfferEnrollments { get; set; }
        public DbSet<Expedition> Expeditions { get; set; }
        public DbSet<ExpeditionEnrollment> ExpeditionEnrollments { get; set; }
        public DbSet<Attatchment> Attatchments { get; set; }
    }
}
