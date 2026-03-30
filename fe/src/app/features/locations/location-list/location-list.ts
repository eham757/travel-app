import { Component, inject, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationService } from '../../../core/services/location/location-service';
import { Location } from '../../../core/models/location';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-location-list',
  imports: [],
  templateUrl: './location-list.html',
  styleUrl: './location-list.css',
})
export class LocationList {
  locationService = inject(LocationService);

  locations: Signal<Location[]> = toSignal(this.locationService.getAll(), {
      initialValue: []
  });
}
