import { AfterViewInit, Component, effect, input, signal, Signal } from '@angular/core';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import View from 'ol/View';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { AttractionTier, CreateLocationRequest, Location } from '../../../core/models/location';

// TODO: This component is currently just a playground for testing out OpenLayers. It will be integrated with the backend and location service in the future to display actual locations from the database and allow users to add new locations by clicking on the map.
// In the furture, this component should be giving some inputs:
// - locations: Location[] - the list of locations to display on the map. This will be used to create markers for each location and display them on the map.
// - onClick: (params) => a callback function that could be for adding new locations or for showing details of a location when a marker is clicked. The params will depend on the use case, but it could include the coordinates of the click event or the id of the location that was clicked on.
// - Start coordinates and zoom level for the map view could also be made configurable through inputs.

@Component({
  selector: 'app-map-viewer',
  imports: [],
  templateUrl: './map-viewer.html',
  styleUrl: './map-viewer.css',
})
export class MapViewer implements AfterViewInit {
  private map?: Map;
  private markerSource = new VectorSource();

  // private locations: CreateLocationRequest[] = [
  //   //netherlands
  //   this.createLocationRequest('Amsterdam', 52.37, 4.9),
  //   this.createLocationRequest('Rotterdam', 51.92, 4.48),
  //   this.createLocationRequest('The Hague', 52.08, 4.3),
  //   this.createLocationRequest('Utrecht', 52.09, 5.12),
  //   this.createLocationRequest('Delft', 52.01, 4.36),
  //   this.createLocationRequest('Leiden', 52.16, 4.49),
  //   this.createLocationRequest('Haarlem', 52.38, 4.63),


  //   //japan
  //   this.createLocationRequest('Tokyo', 35.68, 139.76),
  //   this.createLocationRequest('Kyoto', 35.01, 135.77),
  //   this.createLocationRequest('Osaka', 34.69, 135.5),
  //   this.createLocationRequest('Hiroshima', 34.39, 132.45),
  //   this.createLocationRequest('Nara', 34.68, 135.83),
  // ];
  readonly locations = input<Location[]>([]); // is this the input signal syntax?
  readonly initialCenter = input<[number, number]>([4.33, 52.06]);
  readonly initialZoom = input<number>(7);

  private setupMarkers = effect(() => {
    const locations = this.locations();
    console.log('Locations updated:', locations);
    // Update markers whenever locations change
    if (this.map && this.markerSource) {
      this.markerSource.clear();
      locations.forEach(location => this.addMarkerFeature(location));
    }
  });

  private moveToLocation = effect(() => {
    const zoom = this.initialZoom();
    const center = this.initialCenter();
    if (this.map) {
      this.map.getView().setCenter(fromLonLat(center));
      this.map.getView().setZoom(zoom);
    }

  });

  ngAfterViewInit(): void {
    this.map = this.createMap();
  }

  //effect that updates the markers on the map whenever the locations input signal changes



  createMap = () => {
    return new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.createMarkers()
      ],
      view: new View({
        center: fromLonLat(this.initialCenter()),
        zoom: this.initialZoom()
      })
    });
  }

  createMarkers = () => {
    const features = this.locations().map(location => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([location.longitude, location.latitude])),
        name: location.name
      });
      return feature;
    });

    this.markerSource = new VectorSource({
      features: features
    });

    const markerLayer = new VectorLayer({
      source: this.markerSource,
      style: this.pinStyle
    });
    return markerLayer;
  }

  addMarkerFeature = (location: Location) => {
    this.markerSource.addFeature(
      new Feature({
        geometry: new Point(fromLonLat([location.longitude, location.latitude])),
        name: location.name
      })
    );
  }

  // private createLocationRequest(name: string, latitude: number, longitude: number): Location {
  //   return {
  //     parentLocationId: null,
  //     name,
  //     description: '',
  //     notes: '',
  //     attractionTier: AttractionTier.WorthVisiting,
  //     latitude,
  //     longitude,
  //   };
  // }

  private readonly pinStyle = new Style({
  image: new Icon({
    src: 'https://openlayers.org/en/latest/examples/data/icon.png',
    anchor: [0.5, 1],   // bottom center of image points to coordinate
    scale: 0.8,
  }),
});
}
