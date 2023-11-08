import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateComponent } from './components/add-update/add-update.component';
import { VerificaComponent } from './components/verifica/verifica.component';



@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    AddUpdateComponent,
    VerificaComponent
  ],
  exports:[
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    ReactiveFormsModule,
    AddUpdateComponent,
    VerificaComponent

  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
