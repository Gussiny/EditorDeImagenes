import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.page.html',
  styleUrls: ['./editor.page.scss'],
})
export class EditorPage {
  imagen = null;
  imagenCortada = null;
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  aspect = 4 / 3;
  maintainAspect = true;
  showCropper = false;
  transform: ImageTransform = {};
  containWithinAspectRatio = false;
  @ViewChild(ImageCropperComponent, { static: false}) angularCropper: ImageCropperComponent;

  menuRotar = false;
  menuCortar = true;
  menuZoom = false;
  disabled = false;

  constructor(private toast: ToastController, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe( params => {
      if (this.router.getCurrentNavigation().extras.state){
        this.imagen = this.router.getCurrentNavigation().extras.state.imagen;
      }
    });
  }

  imageLoaded() {
    this.showCropper = true;
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  //  PASAR A GUARDAR LA IMAGEN
  guardarImagen(){
    const navigationExtras: NavigationExtras = {
      state: {
        imagenCortada: this.imagenCortada
      }
    };
    this.router.navigate(['filtros'], navigationExtras);
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
  save() {
    this.angularCropper.crop();
  }

  //  CORTAR IMAGEN
  cortarImagen(event: ImageCroppedEvent){
    this.imagenCortada = event.base64;
  }

  rotar(){
    this.menuRotar = true;
    this.menuCortar = false;
    this.menuZoom = false;
    this.disabled = true;
  }

  cortar(){
    this.menuCortar = true;
    this.menuRotar = false;
    this.menuZoom = false;
    this.disabled = false;
  }

  zoom(){
    this.menuZoom = true;
    this.menuRotar = false;
    this.menuCortar = false;
    this.disabled = false;
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

  //  ALEJAR IMAGEN
  zoomOut() {
    this.scale -= .1;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
  }

  //  ACERCAR IMAGEN
  zoomIn() {
    this.scale += .1;
    this.transform = {
        ...this.transform,
        scale: this.scale
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
