import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { BbddServiceProvider } from "../../providers/bbdd-service/bbdd-service";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'page-new',
  templateUrl: 'new.html'
})
export class NewPage {
  private persona:FormGroup;
  constructor(public navCtrl: NavController,
              private bbddServiceProvider:BbddServiceProvider,
              private formBuilder:FormBuilder,
              private toastCtrl:ToastController) {

    this.persona = this.formBuilder.group({
      name: ["", Validators.required],
      age: ["", Validators.required]
    })
  }

  sendData(){
    this.bbddServiceProvider.insert(this.persona.value)
      .then((data)=>{
          this.presentToast("Registro insertado");
          this.navCtrl.parent.select(1);
          console.log(data);
      })
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
