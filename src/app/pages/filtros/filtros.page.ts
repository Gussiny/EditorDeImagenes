import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.page.html',
  styleUrls: ['./filtros.page.scss'],
})
export class FiltrosPage {

  selectedFilter = '';
  selectedIndex = 0;
  result: HTMLElement;

  imagen: any = '';

  slideOpts = {
    slidesPerView: 3.5,
    spaceBetween: 5,
    slidesOffsetBefore: 20,
    freeMode: true
  };

  filterOptions = [
    { name: 'Normal', value: '' },
    { name: 'Sepia', value: 'sepia' },
    { name: 'Blue Monotone', value: 'blue_monotone' },
    { name: 'Grey', value: 'greyscale' },
    { name: 'Brightness', value: 'brightness' },
    { name: 'Saturation', value: 'saturation' },
    { name: 'Contrast', value: 'contrast' },
    { name: 'Vintage', value: 'vintage' },
    { name: 'Technicolor', value: 'technicolor' },
    { name: 'Polaroid', value: 'polaroid' }
  ];
  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.imagen = this.router.getCurrentNavigation().extras.state.imagenCortada;
      }
    });
  }

  imageLoaded(e) {
    this.result = e.detail.result;
  }

  filter(index) {
    this.selectedFilter = this.filterOptions[index].value;
    this.selectedIndex = index;
  }

  guardarImagen() {
    let base64 = '';
    if (!this.selectedFilter) {
      base64 = this.imagen;
    } else {
      const canvas = this.result as HTMLCanvasElement;
      base64 = canvas.toDataURL('image/png', 1.0);
    }
    const navigationExtras: NavigationExtras = {
      state: {
        imagenCortada: base64
      }
    };
    this.router.navigate(['guardar'], navigationExtras);
  }


}
