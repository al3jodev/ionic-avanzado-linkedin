import { Component } from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';

import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Diagnostic } from '@ionic-native/diagnostic';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              private themeableBrowser:ThemeableBrowser,
              private fTransfer:FileTransfer,
              private file:File,
              private toastCtrl:ToastController,
              diagnostic:Diagnostic,
              private sMS:SMS,
              private callNumber:CallNumber,
              private emailComposer:EmailComposer
              ) {

    diagnostic.requestExternalStorageAuthorization().then(()=>{
      //User gave permission
      console.log('Tiene permisos');
    }).catch(error=>{
    });

  }

  abrirNavegador(){
    const options: ThemeableBrowserOptions = {
      statusbar: {
        color: '#ffffff'
      },
      toolbar: {
        height: 44,
        color: '#f0f0f0'
      },
      title: {
        color: '#666666',
        showPageTitle: true
      },
      backButton: {
        wwwImage: 'assets/icon/back_icon.png',
        wwwImagePressed: 'assets/icon/back_icon_press.png',
        align: 'left',
        event: 'backPressed'
      },
      closeButton: {
        wwwImage: 'assets/icon/close_icon.png',
        wwwImagePressed: 'assets/icon/close_icon_press.png',
        align: 'left',
        event: 'closePressed'
      },
      backButtonCanClose: true
    };

    const browser: ThemeableBrowserObject = this.themeableBrowser.create(
      'https://www.google.es',
      '_blank',
      options);
  }

  descargarArchivo(){
    const fileTransfer: FileTransferObject = this.fTransfer.create();
    const url = 'http://dev.contanimacion.com/chica1.png';
    fileTransfer.download(url, this.file.externalRootDirectory + 'Download/chica1.png', true, {})
      .then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.presentToast("Archivo descargado en " + this.file.externalRootDirectory + 'Download/chica1.png');
    }, (error) => {
      this.presentToast("Error descargando");
      console.log(error);
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

  enviaSMS(){
    this.sMS.send('+34600750553', 'Hello world!');
  }

  llama(){
    this.callNumber.callNumber("+3466666666", true)
      .then(() => console.log('Llamada realizada'))
      .catch(() => console.log('Errorllamando'));
  }

  enviarEmail(){
    this.emailComposer.addAlias('gmail', 'com.google.android.gm');

    let email = {
      app: 'gmail',
      to: 'jorgegvillanueva@gmail.com',
      cc: 'jorge@ge.com',
      bcc: ['jorge@gege.com'],
      attachments: [
        "file:///storage/emulated/0/Download/chica1.png"
      ],
      subject: 'Enviando email',
      body: 'Bienvenido a Ionic',
      isHtml: true
    };

    this.emailComposer.open(email)
      .then(() => console.log('Email enviado'))
      .catch(() => console.log('Error enviando email'));
  }
}
