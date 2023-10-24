import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss'],
})
export class AddUpdateComponent  implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    fechaIngreso: new FormControl('', [Validators.required]),
    tipoVehiculo: new FormControl('', [Validators.required]),
    patente: new FormControl('', [Validators.required, Validators.minLength(4)]),
    reparacion: new FormControl('', [Validators.required, Validators.minLength(4)]),
    monto: new FormControl('', [Validators.required, Validators.min(0)]),
    numWpp: new FormControl('', [Validators.required, Validators.min(10)])
  })

  
  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc : UtilsService
    
    ) {} 

  user = {} as User ;
  
  ngOnInit() {

    this.user = this.utilsSvc.getFromLocalStorage('user');

  }

  //----Tomar o Seleccionar una imagen

  async takeImage(){
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del auto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);

  }

  async submit() {
    if (this.form.valid) {

      let path = `users/${this.user.uid}/recepcion`


      const loading = await this.utilsSvc.loading();
      await loading.present();

      // Subir la imagen y obtener la url 
      let dataUrl = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl =await this.firebaseSvc.uploadImage(imagePath,dataUrl);
      this.form.controls.image.setValue(imageUrl);

      this.firebaseSvc.addDocument(path,this.form.value).then(async res => {

        this.utilsSvc.dismissModal({success :true});

        this.utilsSvc.presentToast({
          message:'Recepcion creada exitosamente',
          duration:1500,
          color:'success',
          position:'middle',
          icon:'checkmark-circle-outline  '

        })
        

      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message:error.message,
          duration:2500,
          color:'primary',
          position:'middle',
          icon:'alert-circle-outline  '

        })
        
      }).finally(()=>{
        loading.dismiss();
      })
    }
  }


  
}
