import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import * as L from 'leaflet';

@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnChanges {
  @Input() source?: { lat: number; lng: number };
  @Input() destination?: { lat: number; lng: number };
  @Input() currentLocation: { lat: number; lng: number };

  private map?: L.Map;
  private sourceMarker?: L.Marker;
  private destinationMarker?: L.Marker;
  private currentLocationMarker?: L.Marker;

  constructor() {
    this.currentLocation = { lat: 6.379448, lng: 2.451324 };
  }

  ngOnInit(): void {
    this.initializeMap(this.currentLocation);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map) {
      if (changes['source'] && changes['source'].currentValue) {
        this.updateSourceMarker(changes['source'].currentValue);
      }
      if (changes['destination'] && changes['destination'].currentValue) {
        this.updateDestinationMarker(changes['destination'].currentValue);
      }
      if (
        changes['currentLocation'] &&
        changes['currentLocation'].currentValue
      ) {
        this.updateCurrentLocationMarker(
          changes['currentLocation'].currentValue
        );
      }
    }
  }

  private initializeMap(currentLocation: { lat: number; lng: number }): void {
    this.map = L.map('map').setView(
      [currentLocation.lat, currentLocation.lng],
      10
    );

    L.tileLayer(
      // 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
      {
        minZoom: 0,
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(this.map);

    const myIcon = L.icon({
      iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue.png',
      iconSize: [20, 20], // size of the icon
    });

    // add popup to makers
    const sourcePopup = L.popup().setContent('Source');
    const destinationPopup = L.popup().setContent('Destination');

    this.sourceMarker = L.marker([0, 0], {
      title: 'Starting Point',
      icon: myIcon,
    })
      .bindPopup(sourcePopup)
      .openPopup()
      .addTo(this.map);
    this.destinationMarker = L.marker([0, 0], {
      title: 'Destination',
      icon: myIcon,
    })
      .bindPopup(destinationPopup)
      .openPopup()
      .addTo(this.map);
    this.currentLocationMarker = L.marker(
      [currentLocation.lat, currentLocation.lng],
      {
        title: 'Current Location',
        icon: myIcon,
      }
    ).addTo(this.map);
  }

  private updateSourceMarker(coords: { lat: number; lng: number }): void {
    this.sourceMarker && this.sourceMarker.setLatLng([coords.lat, coords.lng]);
    this.map && this.map.setView([coords.lat, coords.lng], 10);
  }

  private updateDestinationMarker(coords: { lat: number; lng: number }): void {
    this.destinationMarker &&
      this.destinationMarker.setLatLng([coords.lat, coords.lng]);
  }

  private updateCurrentLocationMarker(coords: {
    lat: number;
    lng: number;
  }): void {
    this.currentLocationMarker &&
      this.currentLocationMarker.setLatLng([coords.lat, coords.lng]);
  }
}
