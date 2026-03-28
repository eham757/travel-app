using travel_app_api.Domain.DomainModels;
using travel_app_api.Repositories;

namespace travel_app_api.Domain.Services
{
    public class LocationService : ILocationService
    {
        private readonly ILocationRepository _locationRepository;

        public LocationService(ILocationRepository locationRepository)
        {
            _locationRepository = locationRepository;
        }

        public async Task<IEnumerable<LocationModel>> GetAllAsync()
        {
            var entities = await _locationRepository.GetAllAsync();
            return entities.Select(x => x.ToDomainModel());
        }

        public async Task<LocationModel?> GetByIdAsync(Guid id)
        {
            var entity = await _locationRepository.GetByIdAsync(id);
            return entity?.ToDomainModel();
        }

        public async Task<LocationModel> CreateAsync(LocationModel model)
        {
            var entity = model.ToEntity();
            var created = await _locationRepository.CreateAsync(entity);
            return created.ToDomainModel();
        }

        public async Task<LocationModel?> UpdateAsync(Guid id, LocationModel model)
        {
            var entity = await _locationRepository.GetByIdAsync(id);

            if (entity is null)
                return null;

            entity.ParentLocationId = model.ParentLocationId;
            entity.Name = model.Name;
            entity.Description = model.Description;
            entity.Notes = model.Notes;
            entity.AttractionTier = model.AttractionTier;
            entity.Latitude = model.Latitude;
            entity.Longitude = model.Longitude;
            entity.LastUpdatedAt = model.LastUpdatedAt;

            var updated = await _locationRepository.UpdateAsync(entity);
            return updated.ToDomainModel();
        }

        public async Task<bool> ArchiveAsync(Guid id)
        {
            return await _locationRepository.ArchiveAsync(id);
        }
    }
}
