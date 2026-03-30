import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapViewer } from './features/maps/map-viewer/map-viewer';
import { LocationList } from './features/locations/location-list/location-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MapViewer, LocationList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('travel-app');
}
