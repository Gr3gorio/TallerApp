import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recepcion } from 'src/app/models/recepcion.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateComponent } from 'src/app/shared/components/add-update/add-update.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  draggingTask: string | null = null;
  sourceBoardIdx: number | null = null;

  constructor (
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private router: Router,
    //private elref: ElementRef,
    
  ) { 
      const usuario = this.user();
      this.getRecepcion(usuario);
  }

 

  recepcion : Recepcion[] = [] ;


  ngOnInit() {

    
  }
  
  async ionViewWillEnter() {
    try {
      const userData = await this.user();
      if (userData) {
        const uid = userData.uid;
        await this.getRecepcion(uid); 
      } else {
        console.error("Los datos del usuario no están disponibles.");
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  }
  
  

  //Obtener las todas las actividades
  async getRecepcion(uid){

     
    let path = `users/${uid}/recepcion`
     console.log("muestrame "+path);
     

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.recepcion = res;
        // Filtra las recepciones que tengan tanto un ID como una patente (Y que pertenezcan a la Recepción)
        const recepcionesValidas = res.filter((recepcion: any) => recepcion.id && recepcion.name && recepcion.patente && recepcion.posicion === 0);
        this.boards[0].recepcion = recepcionesValidas;
        // Filtra las recepciones que tengan tanto un ID como una patente (Y que pertenezcan a la Recepción)
        const TrabajandoValidas = res.filter((recepcion: any) => recepcion.id && recepcion.name && recepcion.patente && recepcion.posicion === 1);
        this.boards[1].recepcion = TrabajandoValidas;
        // Filtra las recepciones que tengan tanto un ID como una patente (Y que pertenezcan a la Recepción)
        const FinalizadasValidas = res.filter((recepcion: any) => recepcion.id && recepcion.name && recepcion.patente && recepcion.posicion === 2);
        this.boards[2].recepcion = FinalizadasValidas;

        sub.unsubscribe();

      }
    })
  

  }

  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
    
  }

  async updateRecepcion(uid,actividad){

     
    let path = `users/${uid}/recepcion/${actividad.id}`
     console.log("muestrame"+path);
     

    this.firebaseSvc.setDocument(path,actividad)
  

  }

  boards = [
    {
      title: 'Recepción',
      recepcion: [
      
      ],
    },
    {
      title: 'Trabajando',
      recepcion: [],
    },
    {
      title: 'Finalizado',
      recepcion: [],
    },
  ];
  

   //--Agregar o Actualizar recepcion----

   addUpdate() {
    this.utilsSvc.presentModal({
      component:AddUpdateComponent,
      
    });
    
  }

 //registra la rececpion que se esta arrastrando
  onDragStart(recepcionId: string, sourceBoardIdx: number) {
    this.draggingTask = recepcionId;
    this.sourceBoardIdx = sourceBoardIdx;
  }

  

  onDrop(targetBoardIdx: number) {
    const userData = this.user();

    if (this.draggingTask !== null && this.sourceBoardIdx !== null) {
      if (this.sourceBoardIdx === targetBoardIdx) {
        // Tarea regresa al mismo tablero, no se hace nada
      } else {
        // Mover tarea a otro tablero
        const taskToMove = this.boards[this.sourceBoardIdx].recepcion.find((recepcion) => recepcion.id === this.draggingTask);
        if (taskToMove) {
          // Agrega la tarea al nuevo tablero
          this.boards[targetBoardIdx].recepcion.push(taskToMove);

          // Elimina la tarea del tablero anterior
          this.boards[this.sourceBoardIdx].recepcion = this.boards[this.sourceBoardIdx].recepcion.filter(
            (recepcion) => recepcion.id !== this.draggingTask
          );
          this.grabarBDmoverActiv(taskToMove, userData.uid, targetBoardIdx);
        }
      }
      this.sourceBoardIdx = null;
      this.draggingTask = null;
    }
  }

  allowDrop(event: Event) {
    event.preventDefault();
  }

 

  mostrarDatosRecepcion(recepcion: any) {
    //console.log('Datos de la recepción:', recepcion);
    // Puedes hacer lo que necesites con los datos de la recepción aquí, como navegar a otra página.
    
    this.router.navigate(['detalle-recepcion', recepcion.id], {
     state: { recepcion }, // Pasa los datos de la recepción como estado

    });

  }

  bajarActividad(event: Event, recepcion: any, targetBoardIdx: number) {
    const buttonElement = event.target as HTMLElement; // Obtiene el elemento de destino (botón)
    const casillero = buttonElement.parentElement.parentElement; // Obtiene el elemento padre del botón
    const userData = this.user();
    
    if (casillero.id !== 'Finalizado') {

      // Agrega la tarea al nuevo tablero
      this.boards[targetBoardIdx+1].recepcion.push(recepcion);

      const indexToRemove = this.boards[targetBoardIdx].recepcion.indexOf(recepcion);
      if (indexToRemove !== -1) {
        this.boards[targetBoardIdx].recepcion.splice(indexToRemove, 1);
      }
      
      //Acá se modifica la tabla a la que pertenece la actividad en la BD
      this.grabarBDbajarActiv(recepcion, userData.uid);
      /*recepcion.posicion = recepcion.posicion + 1;
      console.log(recepcion);
      this.updateRecepcion(userData.uid, recepcion);*/
    }
    

  }

  subirActividad(event: Event, recepcion: any, targetBoardIdx: number) {
    const buttonElement = event.target as HTMLElement; // Obtiene el elemento de destino (botón)
    const casillero = buttonElement.parentElement.parentElement; // Obtiene el elemento padre del botón
    const userData = this.user();
    
    if (casillero.id !== 'Recepción') {

      this.boards[targetBoardIdx-1].recepcion.push(recepcion);
      // Agrega la tarea al nuevo tablero

      const indexToRemove = this.boards[targetBoardIdx].recepcion.indexOf(recepcion);
      if (indexToRemove !== -1) {
        this.boards[targetBoardIdx].recepcion.splice(indexToRemove, 1);
      }

      //Acá se modifica la tabla a la que pertenece la actividad en la BD
      this.grabarBDsubirActiv(recepcion, userData.uid);
      /*recepcion.posicion = recepcion.posicion - 1;
      this.updateRecepcion(userData.uid, recepcion);*/
    }
    

  }

  grabarBDbajarActiv(recepcion: any, uid: string) {
    recepcion.posicion = recepcion.posicion + 1;
    //console.log(recepcion);
    this.updateRecepcion(uid, recepcion);
  }

  grabarBDsubirActiv(recepcion: any, uid: string) {
    recepcion.posicion = recepcion.posicion - 1;
    //console.log(recepcion);
    this.updateRecepcion(uid, recepcion);
  }

  grabarBDmoverActiv(recepcion: any, uid: string, boardsTarget: number) {
    recepcion.posicion = boardsTarget;
    console.log(recepcion);
    this.updateRecepcion(uid, recepcion);
  }

  //--Cerrar sesion----

  signOut() {
    this.firebaseSvc.signOut();
  }



}