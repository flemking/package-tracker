import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
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
  @Input() currentLocation?: { lat: number; lng: number };

  private map!: L.Map;
  private sourceMarker?: L.Marker;
  private destinationMarker?: L.Marker;
  private currentLocationMarker?: L.Marker;

  constructor() {}

  ngOnInit(): void {
    this.initializeMap();
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

  private initializeMap(): void {
    this.map = L.map('map').setView([0, 0], 2);

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
      }
      // 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
      // {
      //   minZoom: 0,
      //   maxZoom: 20,
      //   attribution:
      //     '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      // }
    ).addTo(this.map);

    this.sourceMarker = L.marker([0, 0], { title: 'Source' }).addTo(this.map);
    this.destinationMarker = L.marker([0, 0], { title: 'Destination' }).addTo(
      this.map
    );
    this.currentLocationMarker = L.marker([0, 0], {
      title: 'Current Location',
    }).addTo(this.map);
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
