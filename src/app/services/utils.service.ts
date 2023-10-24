import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private loadignCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router,
    private modalCtrl: ModalController,
   

  ) { }

  


async takePicture (promptLabelHeader:string) {
  return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt,
    promptLabelHeader,
    promptLabelPhoto : 'Selecciona una imagen',
    promptLabelPicture : 'Toma una foto'
    
  });



 
};

  //----------LOADING
  loading() {
    return this.loadignCtrl.create({ spinner: 'crescent' })
  }

  //TOAST
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //--Enruta a cualquier pagina disponible

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // --Guardar elementos en el localStorage

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
  }

  // --Obtiene un elemento desde el localStorage

  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key))
  }

  // --Modal

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();
    //retorna data de la modal si existe cuando se cierre
    const { data } = await modal.onWillDismiss();

    if (data) return data

  }

  //funcion para cerrar la modal que tambien pasa data si la tiene
  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

}
