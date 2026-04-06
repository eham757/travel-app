import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Location, LocationNode } from '../../../core/models/location';
import { MapViewer } from '../../maps/map-viewer/map-viewer';
import { LocationNodeComponent } from '../location-node/location-node';
import Map from 'ol/Map';
import { LocationStore } from '../store/location-store';
import { Button } from "../../../shared/components/button/button";

@Component({
  selector: 'app-location-list',
  imports: [MapViewer, LocationNodeComponent, Button],
  templateUrl: './location-list.html',
  styleUrls: ['./location-list.css'],
})
export class LocationList implements OnInit {
  locationStore = inject(LocationStore);
  locations = this.locationStore.locations;
  selectedLocation = this.locationStore.selectedLocation;

  mapLocations = computed<Location[]>(() => {
    const selected = this.selectedLocation();
    if (selected?.children && selected.children.length > 0) {
      return selected.children as Location[];
    }

    if (selected?.parentLocationId) {
      const parentLocation = this.findLocationNodeById(this.locations(), selected.parentLocationId);
      if (parentLocation?.children && parentLocation.children.length > 0) {
        return parentLocation.children as Location[];
      }
    }

    return this.locations() as Location[];
  });

  zoom = signal<number>(2);
  center = signal<[number, number]>([0, 0]);

  ngOnInit() {
    if (this.locations().length === 0) {
      this.locationStore.loadTopLayerLocations();
    }
  }


  onLocationClick = (location: LocationNode) => {
    this.locationStore.selectLocation(location.id);
    this.locationStore.loadChildrenForLocation(location.id);
  }

  onMapClick = (map: Map, event: any) => {
    map.forEachFeatureAtPixel(event.pixel, (feature) => {
        const locationName = feature.get('name');
        const locationId = feature.get('locationId');
        const locationNode = this.findLocationNodeById(this.locations(), locationId);
        if (locationNode) {
          this.onLocationClick(locationNode);
        }
    });
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
