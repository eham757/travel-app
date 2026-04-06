import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { LocationNode } from '../../../core/models/location';
import { LocationService } from '../../../core/services/location/location-service';

@Injectable({
  providedIn: 'root',
})
export class LocationStore {
  locationService = inject(LocationService);

  locations = signal<LocationNode[]>([]); // This will hold the entire tree of locations
  selectedLocationId = signal<string | null>(null); // This will hold the ID of the currently selected location

  selectedLocation: Signal<LocationNode | null> = computed(() => {
    const id = this.selectedLocationId();
    return id ? this.findLocationNodeById(this.locations(), id) : null;
  }); // This will hold the currently selected location node

  loadChildrenForLocation(locationId: string) {
    this.locationService.getByParentLocationId(locationId).subscribe({
      next: (locations) => {
        this.updateLocationsTreeWithChildren(locationId, locations as LocationNode[]);
      },
      error: (error) => {
        console.error('Error loading locations for parent location id', locationId, error);
      }
    });
  }

  loadTopLayerLocations() {
    this.locationService.getTopLayerLocations().subscribe({
      next: (locations) => {
        this.locations.set(locations as LocationNode[]);
      },
      error: (error) => {
        console.error('Error loading top layer locations', error);
      }
    });
  }

  selectLocation(locationId: string) {
    this.selectedLocationId.set(locationId);
  }

  archiveLocation(locationId: string) {
    this.locationService.archive(locationId).subscribe({
      next: () => {
        this.removeLocationNodeById(locationId);
        if (this.selectedLocationId() === locationId) {
          this.selectedLocationId.set(null);
        }
      },
      error: (error) => {
        console.error('Error archiving location with id', locationId, error);
      }
    });
  }

  createLocation(location: LocationNode) {
    this.locationService.create(location).subscribe({
      next: (createdLocation) => {
        if (createdLocation.parentLocationId) {
          this.loadChildrenForLocation(createdLocation.parentLocationId);
        } else {
          this.loadTopLayerLocations();
        }
      },
      error: (error) => {
        console.error('Error creating location', error);
      }
    });
  }
  
  updateLocation(locationId: string, location: LocationNode) {
    this.locationService.update(locationId, location).subscribe({
      next: (updatedLocation) => {
        if (updatedLocation.parentLocationId) {
          this.loadChildrenForLocation(updatedLocation.parentLocationId);
        } else {
          this.loadTopLayerLocations();
        }
      },
      error: (error) => {
        console.error('Error updating location with id', locationId, error);
      }
    });
  }

  private removeLocationNodeById(id: string) {
    const removeNode = (locations: LocationNode[]): LocationNode[] => {
      return locations
        .filter(location => location.id !== id)
        .map(location => ({
          ...location,
          children: location.children ? removeNode(location.children) : []
        }));
    }
    this.locations.set(removeNode(this.locations()));
  }

  private updateLocationsTreeWithChildren(parentLocationId: string, children: LocationNode[]) {
    const updateTree = (locations: LocationNode[]): LocationNode[] => {
        return locations.map(location => {
            if (location.id === parentLocationId) {
                return { ...location, children };
            }
            if (location.children) {
                return { ...location, children: updateTree(location.children) };
            }
            return location;
        });
    };
    this.locations.set(updateTree(this.locations()));
  }

  private findLocationNodeById(locations: LocationNode[], id: string): LocationNode | null {
    for (const location of locations) {
        if (location.id === id) {
            return location;
        }
        if (location.children) {
            const found = this.findLocationNodeById(location.children, id);
            if (found) {
                return found;
            }
        }
    }
    return null;
  }
}
