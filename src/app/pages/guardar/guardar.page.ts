import { Component, OnInit } from '@angular/core';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { File } from '@ionic-native/file/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, Platform } from '@ionic/angular';
import { base64ToFile } from 'ngx-image-cropper';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@Component({
  selector: 'app-guardar',
  templateUrl: './guardar.page.html',
  styleUrls: ['./guardar.page.scss'],
})
export class GuardarPage{

  imagenCortada = null;
  constructor(private toast: ToastController, private base64ToGallery: Base64ToGallery, private router: Router,
              private route: ActivatedRoute, private file: File, private plat: Platform, private sharing: SocialSharing) {
    this.route.queryParams.subscribe( params => {
      if (this.router.getCurrentNavigation().extras.state){
        this.imagenCortada = this.router.getCurrentNavigation().extras.state.imagenCortada;
      }
    });
  }

  //  GUARDAR IMAGEN EN GALERIA
  guardarImagen() {
    const dataBlob = base64ToFile(this.imagenCortada);
    const folderpath = this.file.dataDirectory;
    const filename = this.createFileName();
    const contentTye = 'image/png';
    if (this.plat.is('android')){
      this.guardarAndroid();
    }else {
      this.guardarIOS(folderpath, filename, dataBlob);
    }
  }

  guardarIOS(folderpath, filename, dataBlob){
    this.file.writeFile(folderpath, filename, dataBlob)
    .then(
      (path) => {
        this.presentToast(folderpath + '/' + filename);
        this.router.navigate(['/']);
      },
      (err) => {
        this.presentToast(err);
      }
    );
  }

  guardarAndroid(){
    this.base64ToGallery.base64ToGallery(
      this.imagenCortada,
      {
        prefix: 'IMG_',
        mediaScanner: false
      }
    ).then(
      (path) => {
        this.presentToast(path);
        this.router.navigate(['/']);
      },
      (err) => {
        this.presentToast(err);
      });
  }

  compartirImagen(){
    const dataBlob = base64ToFile(this.imagenCortada);
    var opciones = {
      files: [this.imagenCortada],
      chooserTitle: 'Compartir Imagen'
    };
    this.sharing.shareWithOptions(opciones);
  }

  createFileName() {
    const d = new Date();
    const n = d.getTime();
    const newFileName = 'IMG_' + n + '.jpg';
    return newFileName;
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

}
