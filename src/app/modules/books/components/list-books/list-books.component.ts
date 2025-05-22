import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Book } from 'src/shared/interfaces/book.interface';
import { ILibro } from 'src/shared/interfaces/libro.interface';
import { AlertService } from 'src/shared/services/alert.service';
import { AuthService } from 'src/shared/services/auth.service';
import { BookService } from 'src/shared/services/book.service';
import { LibroService } from 'src/shared/services/libro.service';
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

  libros: ILibro[] = [];
  filteredLibros: ILibro[] = [];
  selectedLibros: any[] = [];
  private destroy$ = new Subject<void>();
  loading: boolean = false;
  searchQuery: string = '';
  page = 1;
  limit = 14;
  hasMore = true;
  totalLibros = 0;
  dropdownOpen = true;


  pages: number[] = [];

  constructor(
    private router: Router,
    private bookService: BookService,
    private alertService: AlertService,
    private authService: AuthService,
    private librosService: LibroService
  ) {
    const user = this.authService.desencriptarUsuario();
    if (user && user.usu_codigo) {
      this.admin = true;
    }
  }

  ngOnInit() {
    this.loadLibros();

    this.categories.sort((a, b) =>
      a.localeCompare(b, 'es', { sensitivity: 'base' })
    );
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  loadLibros(category: string = '', search: string = '') {
    this.loading = true;

    this.librosService
      .findWithFilters(this.limit, this.page, category || search)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.ok) {
          this.libros = res.items;
          this.filteredLibros = res.items;
          this.loading = false;
          this.totalLibros = res.total;
          this.hasMore = this.libros.length < this.totalLibros;

          this.filteredLibros.forEach((libro) => {
            libro.selected = this.selectedLibros.some(
              (p) => p.libr_codigo === libro.libr_codigo
            );
          });

          const totalPages = Math.ceil(this.totalLibros / this.limit);
          this.pages = [];
          for (let i = 1; i <= totalPages; i++) {
            this.pages.push(i);
          }
        } else {
          console.error('Error al cargar libros', res.message);
          this.loading = false;
        }
      });
  }

  goToPage(page: number) {
    if (page === this.page) return;
    this.page = page;
    this.loadLibros(this.activeCategory, this.searchTerm);
  }

  onImageLoad(book: any) {
    book.loaded = true;
  }

  setActiveCategory(category: string) {
    this.activeCategory = category;
    this.page = 1;
    this.loadLibros(category, '');
  }

  private sortBooksByTitle(books: Book[]): Book[] {
    return books.sort((a, b) =>
      a.title.localeCompare(b.title, 'es', { sensitivity: 'base' })
    );
  }

  loadMoreBooks(): void {
    if (this.page * this.limit < this.totalLibros) {
      this.page++;
      this.loadLibros();
    }
  }

  onSearch(): void {
    this.page = 1;
    if (this.searchTerm.trim() === '') {
      this.loadLibros(this.activeCategory, '');
    } else if (this.searchTerm.length > 2) {
      this.loadLibros(this.activeCategory, this.searchTerm);
    }
  }

  resetPagination(): void {
    this.loadLibros();
  }

  goTo(id: string, mod: string = 'view') {
    this.router.navigateByUrl(`books/${id}/${mod}`);
  }

  operationBook(libro: ILibro, operation: string): void {
    switch (operation) {
      case 'view':
        this.viewBook(libro);
        break;
      case 'edit':
        this.editBook(libro.libr_codigo!);
        break;
      case 'delete':
        this.deleteBook(libro.libr_codigo!);
        break;
      default:
        console.log('Operación no reconocida');
        break;
    }
  }

  viewBook(libro: ILibro) {

    libro.libr_cantidad_vistas!++;

    delete libro.selected;

    this.librosService.update(libro.libr_codigo!, libro).subscribe(res => {
      console.log(res);
      
      if(res.ok) {
        if (libro.libr_urlFile) {
          window.open(libro.libr_urlFile, '_blank');
        }
      }
    })

    
  }

  editBook(id: number): void {
    this.router.navigateByUrl(`books/${id}/edit`);
  }

  deleteBook(id: number): void {
    if (id) {
      this.alertService.confirmDelete(() => {
        this.librosService.remove(id).subscribe({
          next: () => {
            this.filteredLibros = this.filteredLibros.filter(
              (b) => b.libr_codigo !== id
            );

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
