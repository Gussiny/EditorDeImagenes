import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageCroppedEvent, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { ToastController, ActionSheetController, Platform } from '@ionic/angular';

import { FilePath } from '@ionic-native/file-path/ngx';

const STORAGE_KEY = 'mis_imagenes';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  imagen = null;
  imagenCortada = null;
  imagenCargada: any;
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  aspect = 4 / 3;
  maintainAspect = true;
  showCropper = false;
  transform: ImageTransform = {};
  containWithinAspectRatio = false;

  @ViewChild(ImageCropperComponent, { static: false}) angularCropper: ImageCropperComponent;
  constructor(private camara: Camera, private file: File, private toast: ToastController, private storage: Storage,
              private asC: ActionSheetController, private plt: Platform, private filePath: FilePath ) {}

  imageLoaded() {
    // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  //  CARGAR LA IMAGEN DEFAULT
  cargarDefault() {
    this.convertFiletoURL('assets/default.jpg').subscribe(
      base64 => {
        this.imagen = base64;
      }
    );
  }

  //  TOMAR IMAGEN DESDE LA CAMARA

  async capturarImagen(sourceType: PictureSourceType){
    const actionSheet = await this.asC.create({
      header: 'Abrir Imagen',
      buttons: [{
        text: 'Galería',
        icon: 'images',
        handler: () => {
          this.tomarFoto(this.camara.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: 'Cámara',
        icon: 'camera',
        handler: () => {
          this.tomarFoto(this.camara.PictureSourceType.CAMERA);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

  tomarFoto(sourceType: PictureSourceType) {
    const opciones: CameraOptions = {
      quality: 100,
      destinationType: this.camara.DestinationType.DATA_URL,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      sourceType: sourceType
    };

    this.camara.getPicture(opciones).then((imageData) => {
      this.imagen = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      this.presentToast('Could not fetch image');
    });

  }

  async presentToast(text) {
    const toast = await this.toast.create({
        message: text,
        position: 'bottom',
        duration: 5000
    });
    toast.present();
  }

  //  OBTENER EL URL DE LA IMAGEN
  convertFiletoURL(url: string){
    return new Observable ( observer => {
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.onload = () => {
        const fr: FileReader = new FileReader();
        fr.onloadend = () => {
          observer.next(fr.result);
          observer.complete();
        };
        fr.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }


  //  METODOS PARA EDITAR IMAGEN

  //  RESETEA LAS IMAGENES
  reset() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
    this.aspect = 4 / 3;
  }

  // GUARDAR CORTE
  guardar() {
    this.angularCropper.crop();
  }

  //  CORTAR IMAGEN
  cortarImagen(event: ImageCroppedEvent){
    this.imagenCortada = event.base64;
  }

  //  ROTAR IMAGEN A LA IZQUIERDA
  rotarIzquierda() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  //  ROTAR IMAGEN A LA DERECHA
  rotarDerecha() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }
  //  VOLTEAR HORIZONTAL
  voltearH() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  //  VOLTEAR VERTICALMENTE
  voltearV() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  //  ACOMODAR ROTACION
  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
        ...this.transform,
        flipH: flippedV,
        flipV: flippedH
    };
  }

  //  CAMBIAR EL ASPECT RATIO
  aspect1(){
    this.aspect = 1 / 1;
    this.maintainAspect = true;
  }
  aspect4(){
    this.aspect = 4 / 3;
    this.maintainAspect = true;
  }
  aspect16(){
    this.aspect = 16 / 9;
    this.maintainAspect = true;
  }
  aspectLibre(){
    this.maintainAspect = false;
  }



}
