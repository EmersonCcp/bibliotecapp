import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../interfaces/book.interface';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getDoc,
  setDoc,
  doc,
  QueryDocumentSnapshot,
  startAt,
  endAt,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private app = initializeApp(environment.firebaseConfig); // Inicializa la aplicación Firebase
  private db = getFirestore(this.app); // Obtiene la instancia de Firestore

  private booksCollection = collection(this.db, 'books'); // Referencia a la colección de libros
  private lastDoc: QueryDocumentSnapshot<Book> | null = null;

  constructor() {}

  addBook(book: Book): Promise<string> {
    const bookRef = doc(this.booksCollection); // Crea una referencia al nuevo documento dentro de la colección 'books'
    return setDoc(bookRef, book) // Crear y agregar el libro
      .then(() => bookRef.id); // Devuelve el ID una vez que se guarda el libro
  }

  getBooksWithSearch(limitSize: number = 12): Observable<Book[]> {
    let queryRef = query(
      this.booksCollection,
      orderBy('title'),
      limit(limitSize)
    );

    if (this.lastDoc) {
      queryRef = query(queryRef, startAfter(this.lastDoc)); // Continuar después del último documento
    }

    return new Observable<Book[]>((observer) => {
      getDocs(queryRef).then((snapshot) => {
        if (!snapshot.empty) {
          // Actualiza el último documento si hay resultados
          this.lastDoc = snapshot.docs[
            snapshot.docs.length - 1
          ] as QueryDocumentSnapshot<Book>;

          const books = snapshot.docs.map((doc) => {
            // Forzar que 'data' sea de tipo 'Book'
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
   * Obtiene libros filtrados por categoría y paginados.
   * @param category - La categoría por la cual se filtra.
   * @param limitSize - Cantidad de libros por página.
   */
  getBooksByCategory(
    category: string,
    limitSize: number = 10
  ): Observable<Book[]> {
    let queryRef = query(
      this.booksCollection,
      where('category', '==', category),
      orderBy('title'),
      limit(limitSize)
    );

    return new Observable<Book[]>((observer) => {
      getDocs(queryRef)
        .then((snapshot) => {
          if (!snapshot.empty) {
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
    return getDocs(this.booksCollection)
      .then((snapshot) => snapshot.size) // Devuelve el total de documentos
      .catch((error) => {
        console.error('Error al obtener la cantidad de libros:', error);
        return 0; // En caso de error, devuelve 0
      });
  }

  getBookById(id: string): Promise<Book | undefined> {
    const bookRef = doc(this.db, 'books', id);
    return getDoc(bookRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        return docSnapshot.data() as Book;
      } else {
        return undefined; // Si no se encuentra el libro
      }
    });
  }

  getBooksPaginated(
    limitSize: number = 10,
    searchQuery: string = ''
  ): Observable<Book[]> {
    // Base de la consulta ordenada por 'title'
    let queryRef = query(this.booksCollection, orderBy('title'));

    // Filtrado si hay un término de búsqueda
    if (searchQuery) {
      queryRef = query(
        queryRef,
        startAt(searchQuery),
        endAt(searchQuery + '\uf8ff')
      ); // Rango de búsqueda
    }

    // Paginación
    if (this.lastDoc) {
      queryRef = query(queryRef, startAfter(this.lastDoc)); // Continuar después del último documento
    }

    // Limitar el número de documentos por página
    queryRef = query(queryRef, limit(limitSize));

    return new Observable<Book[]>((observer) => {
      getDocs(queryRef)
        .then((snapshot) => {
          if (!snapshot.empty) {
            // Actualizar el último documento si hay resultados
            this.lastDoc = snapshot.docs[
              snapshot.docs.length - 1
            ] as QueryDocumentSnapshot<Book>;

            // Mapear los documentos a objetos del tipo Book
            const books = snapshot.docs.map((doc) => {
              const data = doc.data() as Book; // Forzar que 'data' sea de tipo 'Book'
              const id = doc.id;
              return { id, ...data };
            });

            observer.next(books);
          } else {
            // No hay más documentos, emitir un array vacío
            observer.next([]);
          }
          observer.complete();
        })
        .catch((error) => {
          console.error('Error al obtener los libros:', error);
          observer.error(error); // Emite el error si ocurre uno
        });
    });
  }

  deleteBookById(bookId: string): Observable<void> {
    const bookDocRef = doc(this.db, 'books', bookId); // Referencia al documento del libro

    return new Observable<void>((observer) => {
      deleteDoc(bookDocRef)
        .then(() => {
          observer.next(); // Emite que la eliminación fue exitosa
          observer.complete();
        })
        .catch((error) => {
          console.error('Error al eliminar el libro:', error);
          observer.error(error); // Emite el error si algo falla
        });
    });
  }

  // Método para actualizar un libro por ID
  updateBook(bookId: string, updatedBook: Partial<Book>): Observable<void> {
    const bookDocRef = doc(this.db, 'books', bookId); // Referencia al documento del libro

    return new Observable<void>((observer) => {
      updateDoc(bookDocRef, updatedBook) // Actualiza el libro con los nuevos datos
        .then(() => {
          observer.next(); // Emite que la actualización fue exitosa
          observer.complete();
        })
        .catch((error) => {
          console.error('Error al actualizar el libro:', error);
          observer.error(error); // Emite el error si algo falla
        });
    });
  }
}
