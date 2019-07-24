import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AlertController} from "ionic-angular";

import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { BatteryStatus, BatteryStatusResponse } from '@ionic-native/battery-status';
import { Brightness } from '@ionic-native/brightness';
import { Insomnia } from '@ionic-native/insomnia';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  SO:string;
  version:string;
  UUID:string;

  conectado:boolean = true;

  lowBat:boolean = true;
  prevBr:number = -1;

  siempreActivo:boolean = false;

  constructor(public navCtrl: NavController,
              device:Device,
              network:Network,
              public alertCtrl:AlertController,
              public batteryStatus:BatteryStatus,
              public brightness:Brightness,
              public insomnia:Insomnia,
              androidPermissions:AndroidPermissions) {

    this.SO = device.platform;
    this.version = device.version;
    this.UUID = device.uuid;

    if(network.type == "none" || network.type == "unknown"){
      this.avisaDesconexion();
    }

    let disconnectSubscription = network.onDisconnect().subscribe(() =>{
      if(this.conectado){
        this.avisaDesconexion();
      }
    });

    let connectSubscription = network.onConnect().subscribe(() =>{
      setTimeout(()=>{
        if(!this.conectado){
          this.avisaConexion();
        }
      }, 3000)
    });

    this.controlBateria();

    androidPermissions.checkPermission(androidPermissions.PERMISSION.CAMERA).then(
      succes=>console.log("Tiene permiso para utilizar la cámara"),
      err=> androidPermissions.requestPermission(androidPermissions.PERMISSION.CAMERA)
    );
  }

  avisaDesconexion(){
    this.conectado = false;
    let alert = this.alertCtrl.create({
      title: "Problema de red",
      subTitle: "No tenemos red",
      buttons: ["OK"]
    })
    alert.present();
  }

  avisaConexion(){
    this.conectado = true;
    let alert = this.alertCtrl.create({
      title: "Estado de red",
      subTitle: "Nos hemos conectado a la red",
      buttons: ["OK"]
    })
    alert.present();
  }

  controlBateria(){
    let subscription = this.batteryStatus.onChange().subscribe(
      (status:BatteryStatusResponse)=>{
        this.lowBat = status.level < 30 && !status.isPlugged ;
        if(status.level < 30 && !status.isPlugged){
          if(this.prevBr == -1){
             this.brightness.getBrightness().then((value)=>{
               this.prevBr = value;
             })
            this.brightness.setBrightness(0.35);
          }

        }else{
          if(this.prevBr != -1){
            this.brightness.setBrightness(this.prevBr);
            this.prevBr = -1;
          }
        }
      }
    )

  }

  cambioToggle(){
    if(this.siempreActivo){
      this.insomnia.keepAwake().then(()=>{

      })
    }else{
      this.insomnia.allowSleepAgain().then(()=>{

      })
    }
  }
}
