using Microsoft.EntityFrameworkCore;
using travel_app_api.Data;
using travel_app_api.Repositories.Entities;

namespace travel_app_api.Repositories
{
    public class LocationRepository : ILocationRepository
    {
        private readonly TravelContext _context;

        public LocationRepository(TravelContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LocationEntity>> GetAllAsync()
        {
            return await _context.Locations
                .Where(x => !x.IsArchived)
                .ToListAsync();
        }

        public async Task<IEnumerable<LocationEntity>> GetTopLayerAsync()
        {
            return await _context.Locations
                .Where(x => !x.IsArchived && x.ParentLocationId == null)
                .ToListAsync();
        }

        public async Task<IEnumerable<LocationEntity>> GetByParentIdAsync(Guid parentId)
        {
            return await _context.Locations
                .Where(x => !x.IsArchived && x.ParentLocationId == parentId)
                .ToListAsync();
        }

        public async Task<LocationEntity?> GetByIdAsync(Guid id)
        {
            return await _context.Locations
                .FirstOrDefaultAsync(x => x.Id == id && !x.IsArchived);
        }

        public async Task<LocationEntity> CreateAsync(LocationEntity entity)
        {
            _context.Locations.Add(entity);
            await _context.SaveChangesAsync();

            return entity;
        }

        public async Task<LocationEntity> UpdateAsync(LocationEntity entity)
        {
            _context.Locations.Update(entity);
            await _context.SaveChangesAsync();

            return entity;
        }

        public async Task<bool> ArchiveAsync(Guid id)
        {
            var entity = await _context.Locations
                .FirstOrDefaultAsync(x => x.Id == id && !x.IsArchived);

            if (entity is null)
                return false;

            entity.IsArchived = true;
            entity.LastUpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
