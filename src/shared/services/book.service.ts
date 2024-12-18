import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { Book } from '../interfaces/book.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private booksCollection = this.firestore.collection<Book>('books');
  private lastDoc: firebase.firestore.QueryDocumentSnapshot<unknown> | null =
    null; // Último documento para paginación

  constructor(private firestore: AngularFirestore) {}

  addBook(book: Book): Promise<string> {
    const id = this.firestore.createId(); // Crear un ID para el nuevo documento
    return this.booksCollection
      .doc(id)
      .set(book)
      .then(() => id); // Devuelve el ID una vez que se guarda el libro
  }

  // Obtener libros con paginación
  getBooksWithSearch(limitSize: number = 12): Observable<Book[]> {
    let query = this.booksCollection.ref.orderBy('title').limit(limitSize);

    if (this.lastDoc) {
      query = query.startAfter(this.lastDoc); // Continuar después del último documento
    }

    return new Observable<Book[]>((observer) => {
      query.get().then((snapshot) => {
        if (!snapshot.empty) {
          // Actualiza el último documento si hay resultados
          this.lastDoc = snapshot.docs[snapshot.docs.length - 1];
          const books = snapshot.docs.map((doc) => {
            const data = doc.data() as Book;
            const id = doc.id;
            return { id, ...data };
          });
          observer.next(books);
        } else {
          // No hay más documentos, emitir un array vacío
          observer.next([]);
        }
        observer.complete();
      });
    });
  }

  // Resetear la paginación
  resetPagination(): void {
    this.lastDoc = null;
  }

  /**
   * Obtiene libros paginados y opcionalmente filtrados por título.
   */
  getBooksPaginated(
    limitSize: number = 10,
    searchQuery: string = ''
  ): Observable<Book[]> {
    // Base de la consulta ordenada por 'title'
    let query = this.booksCollection.ref.orderBy('title');

    // Filtrado si hay un término de búsqueda
    if (searchQuery) {
      query = query.startAt(searchQuery).endAt(searchQuery + '\uf8ff'); // Rango de búsqueda
    }

    // Paginación
    if (this.lastDoc) {
      query = query.startAfter(this.lastDoc);
    }

    query = query.limit(limitSize);

    return new Observable<Book[]>((observer) => {
      query.get().then((snapshot) => {
        if (!snapshot.empty) {
          // Actualizar el último documento
          this.lastDoc = snapshot.docs[snapshot.docs.length - 1];

          const books = snapshot.docs.map((doc) => {
            const data = doc.data() as Book;
            const id = doc.id;
            return { id, ...data };
          });

          observer.next(books);
        } else {
          // No hay más documentos
          observer.next([]);
        }
        observer.complete();
      });
    });
  }

  /**
   * Obtiene libros filtrados por categoría y paginados.
   * @param category - La categoría por la cual se filtra.
   * @param limitSize - Cantidad de libros por página.
   */
  getBooksByCategory(
    category: string,
    limitSize: number = 10
  ): Observable<Book[]> {
    // Reiniciar paginación si es necesario
    let query = this.booksCollection.ref
      .where('category', '==', category)
      .orderBy('title');

    // Aplicar paginación
    // if (this.lastDoc) {
    //   query = query.startAfter(this.lastDoc);
    // }

    query = query.limit(limitSize);

    return new Observable<Book[]>((observer) => {
      query
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            // Actualizar el último documento para paginación
            // this.lastDoc = snapshot.docs[snapshot.docs.length - 1];

            const books = snapshot.docs.map((doc) => {
              const data = doc.data() as Book;
              const id = doc.id;
              return { id, ...data };
            });

            observer.next(books);
          } else {
            // No hay resultados
            observer.next([]);
          }
          observer.complete();
        })
        .catch((error) => {
          console.error('Error al filtrar libros por categoría:', error);
          observer.error(error);
        });
    });
  }

  // Método para obtener la cantidad total de libros
  getTotalBooks(): Promise<number> {
    return this.booksCollection
      .get()
      .toPromise()
      .then((snapshot) => {
        return snapshot!.size; // Devuelve el total de documentos
      })
      .catch((error) => {
        console.error('Error al obtener la cantidad de libros:', error);
        return 0; // En caso de error, devuelve 0
      });
  }

  getBookById(id: string): Promise<Book | undefined> {
    return this.booksCollection
      .doc(id)
      .get()
      .toPromise()
      .then((docSnapshot) => {
        if (docSnapshot!.exists) {
          return docSnapshot!.data() as Book;
        } else {
          return undefined; // Si no se encuentra el libro
        }
      });
  }
}
