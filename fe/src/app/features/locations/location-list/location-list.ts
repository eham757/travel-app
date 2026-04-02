import { AfterViewInit, Component, inject, signal} from '@angular/core';
import { LocationService } from '../../../core/services/location/location-service';
import { Location, LocationNode } from '../../../core/models/location';
import { MapViewer } from '../../maps/map-viewer/map-viewer';
import { LocationNodeComponent } from '../location-node/location-node';

@Component({
  selector: 'app-location-list',
  imports: [MapViewer, LocationNodeComponent],
  templateUrl: './location-list.html',
  styleUrls: ['./location-list.css'],
})
export class LocationList implements AfterViewInit {
  locationService = inject(LocationService);
  locations = signal<LocationNode[]>([]);
  mapLocations = signal<Location[]>([]);

  selectedLocation = signal<LocationNode | null>(null);

  zoom = signal<number>(2);
  center = signal<[number, number]>([0, 0]);

  ngAfterViewInit() {
    this.locationService.getTopLayerLocations().subscribe({
        next: (locations) => {
            this.locations.set(locations as LocationNode[]);
            this.mapLocations.set(locations as Location[]);
        },
        error: (error) => {
            console.error('Error loading top layer locations', error);
        }
    });
  }


  onLocationClick = (location: LocationNode) => {
    this.selectedLocation.set(location);

    this.locationService.getByParentLocationId(location.id).subscribe({
        next: (locations) => {
            this.updateLocationsTreeWithChildren(location.id, locations as LocationNode[]);
            const updatedLocation = this.findLocationNodeById(this.locations(), location.id);
            this.updateMapLocationsForSelectedLocation(updatedLocation!);

        },
        error: (error) => {
            console.error('Error loading locations for parent location id', location.id, error);
        }
    });
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

  private updateMapLocationsForSelectedLocation(location: LocationNode) {
    if (location.children && location.children.length > 0) {
        this.mapLocations.set(location.children as Location[]);
    } else {
        const parentLocation = this.findLocationNodeById(this.locations(), location.parentLocationId || '');
        if (parentLocation) {
            this.mapLocations.set(parentLocation.children as Location[]);
        } else {
            this.mapLocations.set(this.locations() as Location[]);
        }
    }
  }
}
