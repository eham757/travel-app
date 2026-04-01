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
    console.log('Location clicked:', location);
    this.selectedLocation.set(location);

    this.locationService.getByParentLocationId(location.id).subscribe({
        next: (locations) => {
            console.log('Locations loaded for parent location id', location.id, locations);
            const index = this.locations().findIndex(loc => loc.id === location.id);
            if (index !== -1) {
                const newLocations = [...this.locations()];
                const updatedLocation = { ...newLocations[index], children: locations as LocationNode[] };
                newLocations[index] = updatedLocation;
                this.locations.set(newLocations);
                if(updatedLocation.children && updatedLocation.children.length > 0) {
                    console.log('Updating map locations to children of location with id', location.id, updatedLocation.children);
                    console.log('Updated location:', updatedLocation.children);
                    this.mapLocations.set(updatedLocation.children as Location[]);
                } else {
                    console.log('No children found for location with id', location.id, 'setting map locations to the location itself');
                    console.log('Updated location:', updatedLocation);
                    this.mapLocations.set([updatedLocation] as Location[]);
                }
            } else {
                console.warn('Location with id', location.id, 'not found in the tree');
                if (!location.parentLocationId){
                    this.mapLocations.set(this.locations() as Location[]);
                }
                else {
                    
                }
            }
        },
        error: (error) => {
            console.error('Error loading locations for parent location id', location.id, error);
        }
    });
  }
}
