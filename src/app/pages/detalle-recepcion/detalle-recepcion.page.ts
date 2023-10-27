import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recepcion } from 'src/app/models/recepcion.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-recepcion',
  templateUrl: './detalle-recepcion.page.html',
  styleUrls: ['./detalle-recepcion.page.scss'],
})
export class DetalleRecepcionPage implements OnInit {

  recepcion: Recepcion;
  dataToSend: any; 

  constructor(private utilsSvc : UtilsService, private route: ActivatedRoute, private alertController: AlertController,) { 
    
    this.route.paramMap.subscribe(params => {
      const recepcionId = params.get('id');
      const state = history.state;
     
      console.log(recepcionId, state);
  
      if (state && state.recepcion) {
        this.recepcion = state.recepcion;
        console.log('Datos llegando:', this.recepcion);

        this.dataToSend = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: environment.recipientPhoneNumber,
          type: "text",
          text: {
            preview_url: false,
            body: `Hola ${this.recepcion.name}! Te damos la bienvenida al TallerMecanico. 
            \n*Patente:* ${this.recepcion.patente}
            \n*Fecha de Ingreso:* ${this.recepcion.fechaIngreso}
            \n*Tipo de Vehiculo:* ${this.recepcion.tipoVehiculo}
            \n*Reparación:* ${this.recepcion.reparacion}
            \n*Monto:* ${this.recepcion.monto}`
          }
        };

      }

    });
  }

  ngOnInit() {}

  // Realiza la solicitud HTTP POST
  async sendWhatsapp() {
    this.utilsSvc.sendMessage(this.dataToSend).subscribe(response => {
      console.log("Respuesta de la API de WhatsApp:", response);
    });
  }  
}
