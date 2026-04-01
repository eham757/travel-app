import { Component, input } from '@angular/core';
import { LocationNode} from '../../../core/models/location';

@Component({
  selector: 'app-location-node',
  imports: [],
  templateUrl: './location-node.html',
  styleUrls: ['./location-node.css'],
})
export class LocationNodeComponent {
  locationNode = input<LocationNode>();
  //input a function to run when the location node is clicked, which will be passed down from the parent component
  onLocationClick = input<(location: LocationNode) => void>();
}
