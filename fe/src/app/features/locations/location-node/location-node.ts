import { Component, computed, effect, inject, input } from '@angular/core';
import { LocationNode} from '../../../core/models/location';
import { LocationStore } from '../store/location-store';

@Component({
  selector: 'app-location-node',
  imports: [],
  templateUrl: './location-node.html',
  styleUrls: ['./location-node.css'],
})
export class LocationNodeComponent {
  locationStore = inject(LocationStore);
  locationNode = input<LocationNode>();
  isSelected = computed(() => this.locationStore.selectedLocationId() === this.locationNode()?.id);
  //input a function to run when the location node is clicked, which will be passed down from the parent component
  onLocationClick = input<(location: LocationNode) => void>();
}
