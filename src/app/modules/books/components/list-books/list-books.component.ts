import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from 'src/shared/interfaces/book.interface';
import { AlertService } from 'src/shared/services/alert.service';
import { BookService } from 'src/shared/services/book.service';
import { categories } from 'src/shared/tips-select/types-select';

@Component({
  selector: 'app-list-books',
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.css'],
})
export class ListBooksComponent implements OnInit {
  books: Book[] = [];
  isLoading: boolean = false;
  searchTerm: string = '';
  categories = categories;
  activeCategory: string = '';
  admin = false;

  constructor(
    private router: Router,
    private bookService: BookService,
    private alertService: AlertService
  ) {
    if (localStorage.getItem('admin')) {
      this.admin = true;
    }
  }

  ngOnInit() {
    this.loadBooks();

    this.categories.sort((a, b) =>
      a.localeCompare(b, 'es', { sensitivity: 'base' })
    );
  }

  loadBooks() {
    this.bookService.getBooksPaginated(12, this.searchTerm).subscribe((res) => {
      if (res.length > 0) {
        this.books = this.sortBooksByTitle(res);
      } else {
        this.books = [];
        console.log('No books found.');
      }
    });
  }

  setActiveCategory(category: string) {
    if (category == '') {
      this.loadBooks();
    } else {
      this.bookService.getBooksByCategory(category, 100).subscribe((res) => {
        if (res) {
          this.books = this.sortBooksByTitle(res);
        }
      });
    }
    this.activeCategory = category;
  }

  private sortBooksByTitle(books: Book[]): Book[] {
    return books.sort((a, b) =>
      a.title.localeCompare(b.title, 'es', { sensitivity: 'base' })
    );
  }

  // Cargar más libros (página siguiente)
  loadMoreBooks(): void {
    if (this.isLoading) return; // Evitar solicitudes duplicadas

    this.isLoading = true;

    this.bookService
      .getBooksPaginated(12, this.searchTerm)
      .subscribe((data) => {
        if (data.length > 0) {
          this.books = [...this.books, ...data];
          this.books = this.sortBooksByTitle(this.books);
        } else {
          console.log('No hay más documentos para cargar');
        }
        this.isLoading = false;
      });
  }

  onSearch(): void {
    // Reiniciar paginación y libros al realizar una nueva búsqueda
    if (this.searchTerm.length > 3) {
      this.books = [];
      this.bookService.resetPagination();
      this.loadBooks();
    } else if (this.searchTerm.length == 0) {
      this.books = [];
      this.bookService.resetPagination();
      this.loadBooks();
    }
  }

  // Resetear la paginación
  resetPagination(): void {
    this.books = [];
    this.bookService.resetPagination();
    this.loadBooks();
  }

  goTo(id: string, mod: string = 'view') {
    this.router.navigateByUrl(`books/${id}/${mod}`);
  }

  operationBook(item: Book, operation: string): void {
    switch (operation) {
      case 'view':
        this.viewBook(item);
        break;
      case 'edit':
        this.editBook(item.id!);
        break;
      case 'delete':
        this.deleteBook(item.id!);
        break;
      default:
        console.log('Operación no reconocida');
        break;
    }
  }

  viewBook(item: Book) {
    if (item.urlFile) {
      window.open(item.urlFile, '_blank');
    } else {
      console.log('La URL del archivo no está disponible');
    }
  }

  editBook(id: string): void {
    this.router.navigateByUrl(`books/${id}/edit`);
  }

  deleteBook(id: string): void {
    if (id) {
      this.alertService.confirmDelete(() => {
        this.bookService.deleteBookById(id).subscribe({
          next: () => {
            this.books = this.books.filter((b) => b.id !== id);

            this.alertService.successOrError(
              'Operación Exitosa!',
              'Libro eliminado',
              'success'
            );
          },
          error: (error) => {
            console.error('Error al eliminar el libro:', error);
            this.alertService.successOrError(
              'Operación Cancelada!',
              'Ocurrió un error',
              'error'
            );
          },
        });
      });
    }
  }
}
