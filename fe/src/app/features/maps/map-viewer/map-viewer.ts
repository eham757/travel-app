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
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
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
  readonly locations = input<Location[]>([]); // is this the input signal syntax?
  readonly center = input<[number, number]>([4.33, 52.06]);
  readonly zoom = input<number>(7);

  private setupMarkers = effect(() => {
    const locations = this.locations();
    // Update markers whenever locations change
    if (this.map && this.markerSource) {
      this.markerSource.clear();
      locations.forEach(location => this.addMarkerFeature(location));
    }
  });

  private moveToLocation = effect(() => {
    const zoom = this.zoom();
    const center = this.center();
    if (this.map) {
      this.map.getView().setCenter(fromLonLat(center));
      this.map.getView().setZoom(zoom);
    }

  });

  ngAfterViewInit(): void {
    this.map = this.createMap();
  }

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
        center: fromLonLat(this.center()),
        zoom: this.zoom()
      })
    });
  }

  createMarkers = () => {
    const features = this.locations().map(location => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([location.longitude, location.latitude])),
        name: location.name,
        attractionTier: location.attractionTier
      });
      return feature;
    });

    this.markerSource = new VectorSource({
      features: features
    });

    const markerLayer = new VectorLayer({
      source: this.markerSource,
      style: (feature) => this.materialPinStyle(feature.get('attractionTier'), feature.get('name')),
    });
    return markerLayer;
  }


  addMarkerFeature = (location: Location) => {
    this.markerSource.addFeature(
      new Feature({
        geometry: new Point(fromLonLat([location.longitude, location.latitude])),
        name: location.name,
        attractionTier: location.attractionTier
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

  //pinstyle that uses the new google material icons with different colors based on the attraction tier of the location
  // adding the atraction tier here ahs one problem, which is that the style is created when the marker layer is created, but the attraction tier of the location is only known when adding the marker feature. So for now, we will just use the same pin style for all markers, but in the future we can create a separate marker layer for each attraction tier and apply the corresponding style to each layer.

  private readonly materialPinStyle = (attractionTier: AttractionTier, name: string) => new Style({
    image: new Icon({
      src: `https://maps.google.com/mapfiles/ms/icons/${this.getPinColor(attractionTier)}-dot.png`, 
      anchor: [0.5, 1],   // bottom center of image points to coordinate
      scale: 1,
    }),
    text: new Text({
      text: name,
      offsetY: -35,
      fill: new Fill({ color: '#000' }),
      stroke: new Stroke({ color: '#fff', width: 2 }),
      font: 'bold 9px Noto Sans, sans-serif',
    }),
  });

  private fitToLocations = effect(() => {
    const locations = this.locations();
    if (this.map && locations.length > 0) {
      const extent = this.markerSource.getExtent();
      this.map.getView().fit(extent!, { padding: [100, 100, 100, 100], maxZoom: 19 });
    }
  });

  private getPinColor(attractionTier: AttractionTier): string {
    switch (attractionTier) {
      case AttractionTier.MustSee:
        return 'red';
      case AttractionTier.WorthVisiting:
        return 'blue';
      case AttractionTier.HiddenGem:
        return 'green';
      default:
        return 'purple';
    }
  }
}
