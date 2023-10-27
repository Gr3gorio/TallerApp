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

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private router: Router,
    
  ) { }

 

recepcion : Recepcion[] = [] ;

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

  ngOnInit() {

    
  }

  user(): User{

    return this.utilsSvc.getFromLocalStorage('user');
    
  }
  
  ionViewWillEnter(){
    this.getRecepcion();
    
  }
  

  //Obtener las rececpiones
  async getRecepcion(){

     
    let path = `users/${this.user().uid}/recepcion`
     console.log("muestrame"+path);
     

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.recepcion = res;
        // Filtra las recepciones que tengan tanto un ID como una patente
        const recepcionesValidas = res.filter((recepcion: any) => recepcion.id && recepcion.name && recepcion.patente);
        this.boards[0].recepcion = recepcionesValidas;

        sub.unsubscribe();

      }
    })
  

  }

  

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

  onTouchStart(recepcionId: string, sourceBoardIdx: number) {
    
    console.log("primer toque");
    
    this.draggingTask = recepcionId;
    this.sourceBoardIdx = sourceBoardIdx;
  }

  onTouchMove(event: TouchEvent, targetBoardIdx: number) {
    event.preventDefault(); // Previene el comportamiento predeterminado del evento táctil
    console.log("funciona");
    
    if (this.draggingTask !== null && this.sourceBoardIdx !== null) {
      
      
      // Mover la tarea a otro tablero
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
        }
      }
      this.sourceBoardIdx = null;
      this.draggingTask = null;
    }
  }
  
  




  onDrop(targetBoardIdx: number) {
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
        }
      }
      this.sourceBoardIdx = null;
      this.draggingTask = null;
    }
  }

  allowDrop(event: Event) {
    event.preventDefault();
  }

  /*
  No implemnetar porque se renderiza mal solo era para ver el pase de los datos

  navegarADetalle(recepcion: any) {
   console.log("funciona");
    this.utilsSvc.saveInLocalStorage('recepcion' , this.recepcion); intente guardar en el storage
   
   
   this.utilsSvc.routerLink(`/detalle-recepcion/${this.recepcion}`);
   
  }*/

  mostrarDatosRecepcion(recepcion: any) {
    //console.log('Datos de la recepción:', recepcion);
    // Puedes hacer lo que necesites con los datos de la recepción aquí, como navegar a otra página.
    
    this.router.navigate(['detalle-recepcion', recepcion.id], {
     state: { recepcion }, // Pasa los datos de la recepción como estado

    });

  }

  //--Cerrar sesion----

  signOut() {
    this.firebaseSvc.signOut();
  }



}
