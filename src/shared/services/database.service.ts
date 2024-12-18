import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  collectionData,
  docData,
} from '@angular/fire/firestore';
import { DocumentReference } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private collectionName = 'items'; // Nombre de tu colección en Firestore

  constructor(private firestore: Firestore) {}

  // Crear un nuevo documento

  addItem(item: any): Promise<DocumentReference<any>> {
    const itemsCollection = collection(this.firestore, this.collectionName);
    return addDoc(itemsCollection, item);
  }

  // Obtener todos los documentos
  getItems(): Observable<any[]> {
    const itemsCollection = collection(this.firestore, this.collectionName);
    return collectionData(itemsCollection, { idField: 'id' });
  }

  // Obtener un documento por ID
  getItemById(id: string): Observable<any> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(itemDoc, { idField: 'id' });
  }

  // Actualizar un documento
  updateItem(id: string, data: any): Promise<void> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return updateDoc(itemDoc, data);
  }

  // Eliminar un documento
  deleteItem(id: string): Promise<void> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(itemDoc);
  }
}
