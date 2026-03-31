import { Component, inject, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationService } from '../../../core/services/location/location-service';
import { Location } from '../../../core/models/location';
import { toSignal } from '@angular/core/rxjs-interop';
import { MapViewer } from '../../maps/map-viewer/map-viewer';

@Component({
  selector: 'app-location-list',
  imports: [MapViewer],
  templateUrl: './location-list.html',
  styleUrl: './location-list.css',
})
export class LocationList {
  locationService = inject(LocationService);

  locations: Signal<Location[]> = toSignal(this.locationService.getAll(), {
      initialValue: []
  });
}
