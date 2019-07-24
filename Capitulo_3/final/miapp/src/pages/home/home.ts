import { Component } from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';

import {
  MediaCapture, MediaFile, CaptureError, CaptureImageOptions,
  CaptureVideoOptions
} from '@ionic-native/media-capture';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  contenidoFoto;
  videoURL;

  constructor(public navCtrl: NavController,
              public camera:Camera,
              public toastCtrl:ToastController,
              public file:File,
              public fileTransfer:FileTransfer,
              public filePath:FilePath,
              public mediaCaptura:MediaCapture,
              public fileOpener:FileOpener) {

  }

  getFromGallery(){
    let options:CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 600,
      correctOrientation: true
    }
    this.camera.getPicture(options).then(
      (imageData)=>{
        this.contenidoFoto = 'data:image/jpeg;base64,' + imageData;
      },
      (err)=>{
        this.presentToast("No se ha seleccionado imagen")
      }
    )
  }

  getFromCamera(){
    let options:CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetWidth: 600,
      targetHeight: 300,
      //allowEdit:true,
      correctOrientation: true,
      saveToPhotoAlbum: false
    }
    this.camera.getPicture(options).then(
      (imageData)=>{
        this.contenidoFoto = 'data:image/jpeg;base64,' + imageData;
      },
      (err)=>{
        this.presentToast("No se ha seleccionado imagen")
      }
    )
  }

  presentToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "bottom"
    })
    toast.present();
  }

  enviarFoto(){
    let options:CameraOptions = {
      quality: 100,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 600,
      targetHeight: 300,
      correctOrientation: true
    }
    this.camera.getPicture(options).then(
      (imagePath)=>{
        this.uploadFile(imagePath);
      },
      (err)=>{
        this.presentToast("No se ha seleccionado imagen")
      }
    )
  }

  uploadFile(imagePath){
    let fileTrasfer:FileTransferObject = this.fileTransfer.create();
    let options:FileUploadOptions = {
      fileKey: 'file',
      fileName: "ionicfile.png",
      mimeType: "image/png",
      headers: {},
      chunkedMode: false
    }

    fileTrasfer.upload(imagePath, "http://www.contanimacion.com/uploadImage", options)
      .then(
        (data)=>{
          this.presentToast("imagen enviada");
        },
        (err)=>{
          this.presentToast("problemas enviando");
        }
      )
  }

  grabarVideo(){
    let options:CaptureVideoOptions = {
      limit: 1,
      duration: 4000
    }
    this.mediaCaptura.captureVideo(options)
      .then(
        (data:MediaFile[])=>{
          let file:MediaFile = data[0];
          this.videoURL = file.fullPath;
        },
        (err)=>{
            this.presentToast("Error capturando vídeo");
        }
      )
  }

  saveFile(){
    this.file.writeFile(this.file.externalRootDirectory, "Download/test.txt", "mimensaje")
      .then(
        (data)=>{
          this.presentToast(this.file.externalRootDirectory + "Download/test.txt");
          this.fileOpener.open(this.file.externalRootDirectory + "Download/test.txt", "text/plain")
            .then(
              ()=>{

              },
              (err)=>{
                this.presentToast("Error abriendo archivo");
              }
            )
        },
        (err)=>{
            this.presentToast("Error guardando datos");
            console.log(err);
        }
      )
  }
}
