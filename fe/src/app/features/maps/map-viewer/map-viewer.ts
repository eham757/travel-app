import { AfterViewInit, Component, Signal } from '@angular/core';
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
import { AttractionTier, CreateLocationRequest } from '../../../core/models/location';

@Component({
  selector: 'app-map-viewer',
  imports: [],
  templateUrl: './map-viewer.html',
  styleUrl: './map-viewer.css',
})
export class MapViewer implements AfterViewInit {
  private map?: Map;
  private markerSource = new VectorSource();

  private locations: CreateLocationRequest[] = [
    //netherlands
    this.createLocationRequest('Amsterdam', 52.37, 4.9),
    this.createLocationRequest('Rotterdam', 51.92, 4.48),
    this.createLocationRequest('The Hague', 52.08, 4.3),
    this.createLocationRequest('Utrecht', 52.09, 5.12),
    this.createLocationRequest('Delft', 52.01, 4.36),
    this.createLocationRequest('Leiden', 52.16, 4.49),
    this.createLocationRequest('Haarlem', 52.38, 4.63),


    //japan
    this.createLocationRequest('Tokyo', 35.68, 139.76),
    this.createLocationRequest('Kyoto', 35.01, 135.77),
    this.createLocationRequest('Osaka', 34.69, 135.5),
    this.createLocationRequest('Hiroshima', 34.39, 132.45),
    this.createLocationRequest('Nara', 34.68, 135.83),
  ];

  ngAfterViewInit(): void {

      //create map
    this.map = this.createMap();

    //add click event to the map to add a marker
    this.map.on('click', (event) => {
      const coordinate = event.coordinate;
      console.log('Clicked coordinate:', coordinate);
      const [lon, lat] = toLonLat(coordinate, 'EPSG:3857');
      console.log('Clicked location (lon, lat):', lon, lat);
      const locationName = prompt('Enter a name for this location:');
      if (locationName) {
        const location = this.createLocationRequest(locationName, lat, lon);
        this.locations.push(location);
        this.addMarkerFeature(location);
      }
    });
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
        center: fromLonLat([4.33, 52.06]),
        zoom: 12
      })
    });
  }

  createMarkers = () => {
    const features = this.locations.map(location => {
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

  addMarkerFeature = (location: CreateLocationRequest) => {
    this.markerSource.addFeature(
      new Feature({
        geometry: new Point(fromLonLat([location.longitude, location.latitude])),
        name: location.name
      })
    );
  }

  private createLocationRequest(name: string, latitude: number, longitude: number): CreateLocationRequest {
    return {
      parentLocationId: null,
      name,
      description: '',
      notes: '',
      attractionTier: AttractionTier.WorthVisiting,
      latitude,
      longitude,
    };
  }

  private readonly pinStyle = new Style({
  image: new Icon({
    src: 'https://openlayers.org/en/latest/examples/data/icon.png',
    anchor: [0.5, 1],   // bottom center of image points to coordinate
    scale: 0.8,
  }),
});
}
