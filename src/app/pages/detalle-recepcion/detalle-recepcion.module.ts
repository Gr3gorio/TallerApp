import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleRecepcionPageRoutingModule } from './detalle-recepcion-routing.module';

import { DetalleRecepcionPage } from './detalle-recepcion.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleRecepcionPageRoutingModule,
    SharedModule
  ],
  declarations: [DetalleRecepcionPage]
})
export class DetalleRecepcionPageModule {}
