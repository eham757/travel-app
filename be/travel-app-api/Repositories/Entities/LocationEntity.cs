using travel_app_api.Domain.Enums;

namespace travel_app_api.Repositories.Entities
{
    public class LocationEntity : BaseEntity
    {
        public Guid? ParentLocationId { get; set; }
        public LocationEntity? ParentLocation { get; set; }
        public ICollection<LocationEntity> ChildLocations { get; set; } = new List<LocationEntity>();
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public AttractionTier AttractionTier { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}
