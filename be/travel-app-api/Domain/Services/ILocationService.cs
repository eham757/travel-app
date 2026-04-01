using travel_app_api.Domain.DomainModels;

namespace travel_app_api.Domain.Services
{
    public interface ILocationService
    {
        Task<IEnumerable<LocationModel>> GetAllAsync();
        Task<IEnumerable<LocationModel>> GetTopLayerAsync();
        Task<IEnumerable<LocationModel>> GetByParentIdAsync(Guid parentId);
        Task<LocationModel?> GetByIdAsync(Guid id);
        Task<LocationModel> CreateAsync(LocationModel model);
        Task<LocationModel?> UpdateAsync(Guid id, LocationModel model);
        Task<bool> ArchiveAsync(Guid id);
    }
}
