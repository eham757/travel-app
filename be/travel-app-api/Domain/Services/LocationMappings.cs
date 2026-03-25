using travel_app_api.Controllers.DTO;
using travel_app_api.Domain.DomainModels;
using travel_app_api.Repositories.Entities;

namespace travel_app_api.Domain.Services
{
    public static class LocationMappings
    {
        public static LocationModel ToDomainModel(this LocationEntity entity)
        {
            return new LocationModel
            {
                Id = entity.Id,
                CreatedAt = entity.CreatedAt,
                LastUpdatedAt = entity.LastUpdatedAt,
                IsArchived = entity.IsArchived,
                ParentLocationId = entity.ParentLocationId,
                Name = entity.Name,
                Description = entity.Description,
                Notes = entity.Notes,
                AttractionTier = entity.AttractionTier,
                Latitude = entity.Latitude,
                Longitude = entity.Longitude,
            };
        }

        public static LocationEntity ToEntity(this LocationModel model)
        {
            return new LocationEntity
            {
                Id = model.Id,
                CreatedAt = model.CreatedAt,
                LastUpdatedAt = model.LastUpdatedAt,
                IsArchived = model.IsArchived,
                ParentLocationId = model.ParentLocationId,
                Name = model.Name,
                Description = model.Description,
                Notes = model.Notes,
                AttractionTier = model.AttractionTier,
                Latitude = model.Latitude,
                Longitude = model.Longitude,
            };
        }

        public static LocationModel ToDomainModel(this CreateLocationRequestDto request)
        {
            var now = DateTime.UtcNow;

            return new LocationModel
            {
                Id = Guid.NewGuid(),
                CreatedAt = now,
                LastUpdatedAt = now,
                IsArchived = false,
                ParentLocationId = request.ParentLocationId,
                Name = request.Name,
                Description = request.Description,
                Notes = request.Notes,
                AttractionTier = request.AttractionTier,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
            };
        }

        public static void UpdateDomainModel(this UpdateLocationRequestDto request, LocationModel model)
        {
            model.ParentLocationId = request.ParentLocationId;
            model.Name = request.Name;
            model.Description = request.Description;
            model.Notes = request.Notes;
            model.AttractionTier = request.AttractionTier;
            model.Latitude = request.Latitude;
            model.Longitude = request.Longitude;
            model.LastUpdatedAt = DateTime.UtcNow;
        }

        public static LocationResponseDto ToResponseDto(this LocationModel model)
        {
            return new LocationResponseDto
            {
                Id = model.Id,
                CreatedAt = model.CreatedAt,
                LastUpdatedAt = model.LastUpdatedAt,
                IsArchived = model.IsArchived,
                ParentLocationId = model.ParentLocationId,
                Name = model.Name,
                Description = model.Description,
                Notes = model.Notes,
                AttractionTier = model.AttractionTier,
                Latitude = model.Latitude,
                Longitude = model.Longitude,
            };
        }
    }
}
