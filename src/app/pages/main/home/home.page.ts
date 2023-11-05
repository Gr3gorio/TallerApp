import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
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
  draggedCardIndex: number | null = null;
  touchStartX: number | null = null;
  touchStartY: number | null = null;


  @ViewChild('recepcionCard', { read: ElementRef }) recepcionCards: ElementRef[];

  panelIndices: { [recepcionId: string]: number } = {};

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private router: Router,
    private renderer: Renderer2 // Inyecta Renderer2
    
  ) { 
    // Inicializa el rastreo de paneles
    this.boards.forEach((board, index) => {
      board.recepcion.forEach((recepcion) => {
        this.panelIndices[recepcion.id] = index;
      });
    });
  }

  

 

recepcion : Recepcion[] = [] ;

boards = [
  {
    title: 'Recepción',
    recepcion: [],
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

//AGREGUE EL PARA CUANDO LE DE A DETAILS MUESTRE LA POSICION
ngOnInit() {
  const savedBoards = localStorage.getItem('boards');
  if (savedBoards) {
    this.boards = JSON.parse(savedBoards);
  } else {
    // Si no hay un estado guardado, carga las recepciones como lo hacías antes
    this.getRecepcion();
  }
}

  user(): User{

    return this.utilsSvc.getFromLocalStorage('user');
    
  }
  
  ionViewWillEnter(){
    this.getRecepcion();
    
  }
  
 
    

  

  //Obtener las rececpiones
   /*getRecepcion(){

     
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
    });
  

  }*/

  // Obtener las recepciones solo si los tableros están vacíos ESTE ES GET REPECION PARA QUE MUESTRE LA POSICION CUANDO TOQUE DETALLE
getRecepcion() {
  if (this.boards[0].recepcion.length === 0) {
    // Llama a Firebase solo si el tablero de Recepción está vacío
    // Esto evitará la recarga innecesaria de datos de Firebase al recargar la página
    let path = `users/${this.user().uid}/recepcion`;
    console.log("muestrame" + path);

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.recepcion = res;
        // Filtra las recepciones que tengan tanto un ID como una patente
        const recepcionesValidas = res.filter((recepcion: any) => recepcion.id && recepcion.name && recepcion.patente);
        this.boards[0].recepcion = recepcionesValidas;

        // Guarda el estado actual en el almacenamiento local
        localStorage.setItem('boards', JSON.stringify(this.boards));

        sub.unsubscribe();
      }
    });
  }
}

   //--Agregar o Actualizar recepcion----

   addUpdate() {
    this.utilsSvc.presentModal({
      component:AddUpdateComponent,
      
    });
    
  }

  isMobileDevice(): boolean {
    const screenWidth = window.innerWidth;
    const mobileScreenMaxWidth = 767; // Ajusta este valor según tus necesidades
  
    return screenWidth <= mobileScreenMaxWidth;
  }
  

  currentPanelIndex: number = 0;

 

  avanzarPanel(recepcionId: string) {
    console.log("Avanzar");
    
    
    const currentIndex = this.boards.findIndex(board => board.recepcion.some(recepcion => recepcion.id === recepcionId));

    
    if (currentIndex < this.boards.length - 1) {
      const currentBoard = this.boards[currentIndex];
      const nextBoard = this.boards[currentIndex + 1];
      const taskToMove = currentBoard.recepcion.find(recepcion => recepcion.id === recepcionId);
  
      if (taskToMove) {
        nextBoard.recepcion.push(taskToMove);
        currentBoard.recepcion = currentBoard.recepcion.filter(recepcion => recepcion.id !== recepcionId);
      }
    }
  }
  
  retrocederPanel(recepcionId: string) {
    console.log("Retroceder");
    
    
    const currentIndex = this.boards.findIndex(board => board.recepcion.some(recepcion => recepcion.id === recepcionId));
    
    if (currentIndex > 0) {
      const currentBoard = this.boards[currentIndex];
      const previousBoard = this.boards[currentIndex - 1];
      const taskToMove = currentBoard.recepcion.find(recepcion => recepcion.id === recepcionId);
  
      if (taskToMove) {
        previousBoard.recepcion.push(taskToMove);
        currentBoard.recepcion = currentBoard.recepcion.filter(recepcion => recepcion.id !== recepcionId);
      }
    }
  }
  
  
  
    
  
  
  

 //registra la rececpion que se esta arrastrando
 onDragStart(recepcionId: string, sourceBoardIdx: number, event: MouseEvent | TouchEvent) {
  this.draggingTask = recepcionId;
  this.sourceBoardIdx = sourceBoardIdx;
  console.log("Registro");
  console.log("draging" + this.draggingTask);
  console.log("source" + this.sourceBoardIdx);

  // Agrega un console.log para verificar si es un dispositivo móvil
  console.log("¿Es un dispositivo móvil?", this.isMobileDevice());

 
}


  /*onTouchStart(recepcionId: string, sourceBoardIdx: number) {
    
    console.log("primer toque");
    
    this.draggingTask = recepcionId;
    this.sourceBoardIdx = sourceBoardIdx;
  }*/

/*onTouchMove(event: TouchEvent, targetBoardIdx: number) {
  event.preventDefault(); // Previene el comportamiento predeterminado del evento táctil
  console.log("Touch move funciona");

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
}*/

// ...
/*onTouchStart(recepcionId: string, sourceBoardIdx: number, index: number, event: TouchEvent) {
  this.draggingTask = recepcionId;
  this.sourceBoardIdx = sourceBoardIdx;
  this.draggedCardIndex = index;
  
  // Almacena la posición inicial del toque
  this.touchStartX = event.touches[0].clientX;
  this.touchStartY = event.touches[0].clientY;
  console.log("primer toque");
  
}*/


/*
onTouchMove(event: TouchEvent, targetBoardIdx: number, cardIndex: number) {
  console.log("segundo toque");
   
  event.preventDefault();
  if (this.draggingTask !== null && this.sourceBoardIdx !== null) {
    if (this.sourceBoardIdx === targetBoardIdx) {
      console.log(" primer log");
      console.log(this.sourceBoardIdx +" sourcebox");
      console.log(targetBoardIdx +" targetboax");
      
      // Tarea regresa al mismo tablero, no se hace nada
    } else {
      // Mover tarea a otro tablero
      console.log("segundo log");
      const taskToMove = this.boards[this.sourceBoardIdx].recepcion.find((recepcion) => recepcion.id === this.draggingTask);
      if (taskToMove) {
        this.boards[targetBoardIdx].recepcion.push(taskToMove);
        this.boards[this.sourceBoardIdx].recepcion = this.boards[this.sourceBoardIdx].recepcion.filter(
          (recepcion) => recepcion.id !== this.draggingTask
        );
        
        // Calcula la diferencia entre la posición actual y la posición inicial
        const currentX = event.touches[0].clientX - this.touchStartX;
        const currentY = event.touches[0].clientY - this.touchStartY;
        
        // Aplica la transformación al elemento DOM correspondiente
        this.renderer.setStyle(this.recepcionCards[cardIndex].nativeElement, 'transform', `translate(${currentX}px, ${currentY}px)`);
        
        
      }
    }
    
    this.sourceBoardIdx = null;
    this.draggingTask = null;
  }
}*/



  onDrop(targetBoardIdx: number) {
    if (this.draggingTask !== null && this.sourceBoardIdx !== null) {
      if (this.sourceBoardIdx === targetBoardIdx) {
        // Tarea regresa al mismo tablero, no se hace nada
      } else {
        // Mover tarea a otro tablero
        console.log("mueve a otro tablero");
        console.log(this.sourceBoardIdx +" sourcebox del mosue");
      console.log(targetBoardIdx +" targetboax del mouse");
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
    
    // Puedo hacer lo que necesite con los datos de la recepción aquí, como navegar a otra página.
    
    this.router.navigate(['detalle-recepcion', recepcion.id], {
     state: { recepcion }, // Pasa los datos de la recepción como estado

    });

  }

  //--Cerrar sesion----

  signOut() {
    this.firebaseSvc.signOut();
  }



}
