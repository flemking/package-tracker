import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { ActivatedRoute } from '@angular/router';
import { DeliveryService } from '../../../apis/delivery.service';
import { PackageService } from '../../../apis/package.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapsComponent implements OnInit, AfterViewInit {
  entityId: any;
  deliveryDetails: any;
  packageDetails: any;

  private map: google.maps.Map | undefined;
  private marker: google.maps.Marker | undefined;

  constructor(
    private route: ActivatedRoute,
    private _deliveryService: DeliveryService,
    private _packagesService: PackageService
  ) {}

  ngOnInit(): void {
    // Récupération l'ID de la livraison depuis les paramètres de l'URL
    this.route.params.subscribe(async (params) => {
      this.entityId = params['id'];

      let packageResponse: any;

      try {
        // Tentative de recherche sur le modèle package
        packageResponse = await this._packagesService
          .getPackageById(this.entityId)
          .toPromise();
      } catch (error) {
        console.error(error);
      }

      if (packageResponse) {
        this.packageDetails = packageResponse;
        if (this.packageDetails.active_delivery_id) {
          const deliveryResponse: any = await this._deliveryService
            .getDeliveryById(this.packageDetails.active_delivery_id)
            .toPromise();
          if (deliveryResponse && deliveryResponse.location) {
            const lat = deliveryResponse.location.lat;
            const lng = deliveryResponse.location.lng;
            this.initializeMap(lat, lng);
          } else {
            console.error('Location not found');
          }
        } else if (this.packageDetails.from_location) {
          const lat = this.packageDetails.from_location.lat;
          const lng = this.packageDetails.from_location.lng;
          this.initializeMap(lat, lng);
        } else {
          console.error('Location not found');
        }
      } else {
        const deliveryResponse: any = await this._deliveryService
          .getDeliveryById(this.entityId)
          .toPromise();
        if (deliveryResponse && deliveryResponse.location) {
          const lat = deliveryResponse.location.lat;
          const lng = deliveryResponse.location.lng;
          this.initializeMap(lat, lng);
        } else {
          const lat = deliveryResponse.package_id.from_location.lat;
          const lng = deliveryResponse.package_id.from_location.lng;
          this.initializeMap(lat, lng);
        }
      }
    });
  }

  ngAfterViewInit() {
    const loader = new Loader({
      apiKey: 'AIzaSyABllXWc735BWqURbAcpxsPqaBl4HGPYGg',
    });

    loader.load().then(() => {
      console.log('Map loaded');
    });
  }

  initializeMap(lat: number, lng: number) {
    const mapOptions: google.maps.MapOptions = {
      center: { lat, lng },
      zoom: 12,
    };

    const mapElement = document.getElementById('map');
    if (mapElement) {
      this.map = new google.maps.Map(mapElement, mapOptions);

      // Marker
      const markerOptions: google.maps.MarkerOptions = {
        position: { lat, lng },
        map: this.map,
        title: 'Package Position',
      };

      this.marker = new google.maps.Marker(markerOptions);
    } else {
      console.error('Map element not found');
    }
  }
}
