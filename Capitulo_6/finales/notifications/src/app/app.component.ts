import { Component } from '@angular/core';
import {Platform, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  id
  token

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              private oneSignal:OneSignal,
              private toastCtrl:ToastController) {
    platform.ready().then(() => {

      this.oneSignal.startInit("5dc778e9-248e-4b2c-8e0e-d53d4553e3a6", "351229488890");

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      this.oneSignal.setSubscription(true);

      this.oneSignal.getIds()
        .then(
          (ids)=>{
            this.id = ids.userId;
            this.token = ids.pushToken;
          }
        );

      this.oneSignal.handleNotificationReceived().subscribe((data)=>{
        console.log("Recibida notificación");
        console.log(data);
      })

      this.oneSignal.handleNotificationOpened().subscribe((data)=>{
        console.log("Abierta notificación");
        console.log(data);
        this.presentToast(data.notification.payload.title +
          ": " + data.notification.payload.body);
      })

      this.oneSignal.endInit();

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
