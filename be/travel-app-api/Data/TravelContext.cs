using Microsoft.EntityFrameworkCore;
using travel_app_api.Repositories.Entities;

namespace travel_app_api.Data
{
    public class TravelContext : DbContext
    {
        public DbSet<LocationEntity> Locations { get; set; }
        public TravelContext(DbContextOptions<TravelContext> options) : base(options) {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<LocationEntity>(entity =>
            {
                entity.Property(x => x.Name).HasMaxLength(200).IsRequired();
                entity.Property(x => x.Description).HasMaxLength(16000);
                entity.Property(x => x.Notes).HasMaxLength(4000);

                entity.Property(x => x.Latitude).HasPrecision(12, 9);
                entity.Property(x => x.Longitude).HasPrecision(12, 9);

                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.ParentLocation)
                .WithMany(e => e.ChildLocations)
                .HasForeignKey(e => e.ParentLocationId)
                .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.ParentLocationId);
            });
        }
    }
}
