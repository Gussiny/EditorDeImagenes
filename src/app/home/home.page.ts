import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageCropperComponent} from 'ngx-image-cropper';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  imagen = null;

  @ViewChild(ImageCropperComponent, { static: false}) angularCropper: ImageCropperComponent;
  constructor(private camara: Camera,
              private toast: ToastController,
              private asC: ActionSheetController,
              private router: Router
              ) {}


  //  CARGAR LA IMAGEN DEFAULT
  cargarDefault() {
    this.convertFiletoURL('assets/default.jpg').subscribe(
      base64 => {
        this.imagen = base64;
        this.pasarImagen();
      }
    );
  }

  //  TOMAR IMAGEN DESDE EL DISPOSITIVO
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
      sourceType
    };

    this.camara.getPicture(opciones).then((imageData) => {
      this.imagen = 'data:image/jpeg;base64,' + imageData;
      this.pasarImagen();
    }, (err) => {
      this.presentToast('Could not fetch image');
    });
  }

  //  PASAR IMAGEN
  pasarImagen(){
    const navigationExtras: NavigationExtras = {
      state: {
        imagen: this.imagen
      }
    };
    this.router.navigate(['editor'], navigationExtras);
  }


  //  MOSTRAR TOAST
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

}
