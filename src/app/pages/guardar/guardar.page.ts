import { Component, OnInit } from '@angular/core';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-guardar',
  templateUrl: './guardar.page.html',
  styleUrls: ['./guardar.page.scss'],
})
export class GuardarPage {

  imagenCortada = null;
  constructor(private toast: ToastController, private base64ToGallery: Base64ToGallery, private router: Router,
              private route: ActivatedRoute) {
    this.route.queryParams.subscribe( params => {
      if (this.router.getCurrentNavigation().extras.state){
        this.imagenCortada = this.router.getCurrentNavigation().extras.state.imagenCortada;
      }
    });
  }

  //  GUARDAR IMAGEN EN GALERIA
  guardarImagen() {
    // base64ToFile(this.imagenCortada);
    this.base64ToGallery.base64ToGallery(
      this.imagenCortada,
      {
        prefix: 'img_',
        mediaScanner: true
      }
    ).then(
      (path) => {
        this.presentToast(path);
        this.router.navigate(['/']);
      },
      (err) => {
        this.presentToast(err);
      }
    );
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
