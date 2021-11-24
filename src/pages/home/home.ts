import { Component, ElementRef, ViewChild } from '@angular/core';
import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from '../../environments/environment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapView: ElementRef;

  constructor() {
    CapacitorGoogleMaps.initialize({
      key: environment.mapsKey
    });
  }

  ionViewDidEnter() {
    this.loadMap('normal');
  }

  ionViewDidLeave() {
    CapacitorGoogleMaps.close();
  }

  loadMap(type_map) {
    Geolocation.requestPermissions().then(async premission => {
      const coordinates = await Geolocation.getCurrentPosition();

      console.log(coordinates, "coordinates");

      const boundingRect = this.mapView.nativeElement.getBoundingClientRect() as DOMRect;

      CapacitorGoogleMaps.create({
          width: Math.round(boundingRect.width),
          height: Math.round(boundingRect.height),
          x: Math.round(boundingRect.x),
          y: Math.round(boundingRect.y),
          latitude: coordinates.coords.latitude,
          longitude: coordinates.coords.longitude,
          zoom: 16
      });

      CapacitorGoogleMaps.addListener('onMapReady', async () => {
        console.log("MAP READY");

        CapacitorGoogleMaps.setMapType({
            type: type_map
        });

        // Create our current location marker
        CapacitorGoogleMaps.addMarker({
            latitude: coordinates.coords.latitude,
            longitude: coordinates.coords.longitude,
            title: 'Mi ubicación',
        });
      });
    });

  }

}
