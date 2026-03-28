using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using travel_app_api.Controllers.DTO;
using travel_app_api.Domain.Services;

namespace travel_app_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationController : ControllerBase
    {
        private readonly ILocationService _locationService;

        public LocationController(ILocationService locationService)
        {
            _locationService = locationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LocationResponseDto>>> GetAll()
        {
            var locations = await _locationService.GetAllAsync();
            return Ok(locations.Select(x => x.ToResponseDto()));
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<LocationResponseDto>> GetById(Guid id)
        {
            var location = await _locationService.GetByIdAsync(id);

            if (location is null)
                return NotFound();

            return Ok(location.ToResponseDto());
        }

        [HttpPost]
        public async Task<ActionResult<LocationResponseDto>> Create(CreateLocationRequestDto request)
        {
            var model = request.ToDomainModel();
            var created = await _locationService.CreateAsync(model);

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created.ToResponseDto());
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<LocationResponseDto>> Update(Guid id, UpdateLocationRequestDto request)
        {
            var existing = await _locationService.GetByIdAsync(id);

            if (existing is null)
                return NotFound();

            request.UpdateDomainModel(existing);

            var updated = await _locationService.UpdateAsync(id, existing);

            return Ok(updated!.ToResponseDto());
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Archive(Guid id)
        {
            var archived = await _locationService.ArchiveAsync(id);

            if (!archived)
                return NotFound();

            return NoContent();
        }
    }
}
