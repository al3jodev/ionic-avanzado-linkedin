import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mapElement;
  map;
  constructor(public navCtrl: NavController,
              private googleMaps: GoogleMaps,
              private geolocation:Geolocation) {

  }

  ionViewDidLoad() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.loadMap(resp.coords);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  loadMap(coords) {
    this.mapElement = document.getElementById('map');

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: coords.latitude,
          lng: coords.longitude
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = this.googleMaps.create(this.mapElement, mapOptions);

    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        this.map.addMarker({
          title: 'Ionic',
          icon: 'blue',
          animation: 'DROP',
          position: {
            lat: coords.latitude,
            lng:coords.longitude
          }
        })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
          });

      });
  }
}
