import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapViewer } from './features/maps/map-viewer/map-viewer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MapViewer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('travel-app');
}
