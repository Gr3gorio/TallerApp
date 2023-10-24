import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recepcion } from 'src/app/models/recepcion.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-detalle-recepcion',
  templateUrl: './detalle-recepcion.page.html',
  styleUrls: ['./detalle-recepcion.page.scss'],
})
export class DetalleRecepcionPage implements OnInit {

  recepcion: Recepcion;

  constructor(

    private firebaseSvc: FirebaseService,
    private utilsSvc : UtilsService,
    private route: ActivatedRoute,
    
    
    
  ) { 

    this.route.paramMap.subscribe(params => {
      const recepcionId = params.get('id');
      const state = history.state;
     
      console.log(recepcionId, state);
      
  
      if (state && state.recepcion) {
        this.recepcion = state.recepcion;
        console.log('Datos llegando:', this.recepcion);
      }
    });
  }

  ngOnInit() {}

  sendWhatsapp(){
    console.log("envia a whatsapp: ", this.recepcion);
    let url= `https://api.whatsapp.com/send?phone=${this.recepcion.numWpp}&text=*_TallerMecanico_*%0A*Nombre:*%0A${this.recepcion.name}%0A*Patente:*%0A${this.recepcion.patente}%0A*Monto:*%0A${this.recepcion.monto}`;
    window.open(url)
  }

  sendEmail() {
    console.log("envia por gmail: ", this.recepcion);
    
  }
}
