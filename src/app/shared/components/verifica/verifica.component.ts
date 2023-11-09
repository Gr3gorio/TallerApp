import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Recepcion } from 'src/app/models/recepcion.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-verifica',
  templateUrl: './verifica.component.html',
  styleUrls: ['./verifica.component.scss'],
})
export class VerificaComponent  implements OnInit {
  /*form = new FormGroup({
    
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    fechaIngreso: new FormControl('', [Validators.required]),
    tipoVehiculo: new FormControl('', [Validators.required]),
    patente: new FormControl('', [Validators.required, Validators.minLength(4)]),
    reparacion: new FormControl('', [Validators.required, Validators.minLength(4)]),
    monto: new FormControl('', [Validators.required, Validators.min(0)]),
    numWpp: new FormControl('', [Validators.required, Validators.min(10)]),
    posicion: new FormControl(0,)
  })*/
  @Input() recepcion: Recepcion;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc : UtilsService,
    private router: Router,
    
    ) {} 

    user(): User{
      return this.utilsSvc.getFromLocalStorage('user');
      
    }

    dismissModal(){
      this.utilsSvc.dismissModal();
    }
  
  ngOnInit() {

    //this.user = this.utilsSvc.getFromLocalStorage('user');

  }

  borrarActividad(actividad: any) {
    //console.log(actividad);
    const userData = this.user();
    //console.log(userData);

    
    this.borrar(userData.uid,actividad);
    
    this.router.navigate(['/main/home']);
    this.dismissModal();

  }

  async borrar(uid,actividad){

     
    let path = `users/${uid}/recepcion/${actividad.id}`
     console.log("muestrame"+path);
     

    this.firebaseSvc.deleteDocument(path,actividad);

    

  }

}
