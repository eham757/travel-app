using travel_app_api.Domain.Enums;

namespace travel_app_api.Controllers.DTO
{
    public class LocationResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; }
        public bool IsArchived { get; set; }
        public Guid? ParentLocationId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public AttractionTier AttractionTier { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}
