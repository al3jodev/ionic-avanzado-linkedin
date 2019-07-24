import { Component } from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';

import {OneSignal, OSNotification} from '@ionic-native/onesignal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              private oneSignal:OneSignal,
              private toastCtrl:ToastController) {

  }

  sendNotification(){
    let obj:any    = {
      headings: {en:"Título del mensaje"},
      contents: {en: "Este es el cuerpo del mensauje"},
      include_player_ids: ["9e876862-651b-4fbd-a762-d109004880c8"]
    }
    this.oneSignal.postNotification(obj)
      .then(()=>{this.presentToast("Notificación enviada")})
      .catch((err)=>{
          this.presentToast("Error enviando notificación");
          console.log(err);
      })
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
