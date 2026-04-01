using travel_app_api.Repositories.Entities;

namespace travel_app_api.Repositories
{
    public interface ILocationRepository
    {
        Task<IEnumerable<LocationEntity>> GetAllAsync();
        Task<IEnumerable<LocationEntity>> GetTopLayerAsync();
        Task<IEnumerable<LocationEntity>> GetByParentIdAsync(Guid parentId);
        Task<LocationEntity?> GetByIdAsync(Guid id);
        Task<LocationEntity> CreateAsync(LocationEntity entity);
        Task<LocationEntity> UpdateAsync(LocationEntity entity);
        Task<bool> ArchiveAsync(Guid id);
    }
}
