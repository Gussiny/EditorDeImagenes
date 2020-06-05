import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiltrosPageRoutingModule } from './filtros-routing.module';

import { FiltrosPage } from './filtros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiltrosPageRoutingModule
  ],
  declarations: [FiltrosPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FiltrosPageModule {}
