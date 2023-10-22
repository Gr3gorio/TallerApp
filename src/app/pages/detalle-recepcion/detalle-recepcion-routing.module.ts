import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleRecepcionPage } from './detalle-recepcion.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleRecepcionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleRecepcionPageRoutingModule {}
