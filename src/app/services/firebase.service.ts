import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection , collectionData , query } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage , uploadString , ref , getDownloadURL } from 'firebase/storage';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private utilsSvc: UtilsService,
    private storage : AngularFireStorage

  ) { }

  //-----------AUTENTICACION----------------------

  getAuth() {
    return getAuth();
  }

  //Acceder

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //Crear usuario

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //Actualizar usuario

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  //Enviar email para reestablecer contraseña

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //Cerrar sesion
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('boards');
    this.utilsSvc.routerLink('/auth');
  }



  //-----------BASE DE DATOS----------------------

  //Obtener los datos de una coleccion
  getCollectionData(path: string , collectionQuery?:any){
    const ref = collection(getFirestore(), path)
    return collectionData (query(ref,collectionQuery),{idField : 'id'});

  }

  //Setear un Documento (crea un documento o reemplaza si es que existe)

  setDocument(path: string, data: any) {

    return setDoc(doc(getFirestore(), path), data);

  }

  //Obtener un Documento 

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //Agregar un Documento 

  async addDocument(path: string, data: any) {

    return addDoc(collection(getFirestore(), path), data);

  }

//-----------Almacenamiento----------------------

//Subir una imagen y obtengo la URL para guardarla en la BBDD

async uploadImage(path : string , data_url:string){

  return uploadString(ref(getStorage(),path),data_url,'data_url').then(()=>{
    return getDownloadURL(ref(getStorage(),path))
  })

}

}
