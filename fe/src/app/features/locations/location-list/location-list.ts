import { AfterViewInit, Component, inject, signal, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationService } from '../../../core/services/location/location-service';
import { Location } from '../../../core/models/location';
import { toSignal } from '@angular/core/rxjs-interop';
import { MapViewer } from '../../maps/map-viewer/map-viewer';

@Component({
  selector: 'app-location-list',
  imports: [MapViewer],
  templateUrl: './location-list.html',
  styleUrls: ['./location-list.css'],
})
export class LocationList implements AfterViewInit {
  locationService = inject(LocationService);
  locations = signal<Location[]>([]);

  selectedLocation = signal<Location | null>(null);

  ngAfterViewInit() {
    this.locationService.getTopLayerLocations().subscribe({
        next: (locations) => {
            this.locations.set(locations);
        },
        error: (error) => {
            console.error('Error loading top layer locations', error);
        }
    });
  }


  onLocationClick(location: Location) {
    console.log('Location clicked:', location);
    this.selectedLocation.set(location);

    this.locationService.getByParentLocationId(location.id).subscribe({
        next: (locations) => {
            console.log('Locations loaded for parent location id', location.id, locations);
            this.locations.set(locations);
        },
        error: (error) => {
            console.error('Error loading locations for parent location id', location.id, error);
        }
    });
  }
}
