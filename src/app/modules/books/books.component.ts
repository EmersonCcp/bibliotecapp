import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/shared/services/alert.service';
import { AuthService } from 'src/shared/services/auth.service';
import { BookService } from 'src/shared/services/book.service';
import { LibroService } from 'src/shared/services/libro.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent {
  totalBooks = 0;
  admin = false;

  constructor(
    private router: Router,
    private bookService: BookService,
    private authService: AuthService,
    private alertService: AlertService,
    private librosService: LibroService
  ) {
    const user = this.authService.desencriptarUsuario();
    if (user && user.usu_codigo) {
      this.admin = true;
    }

    this.loadLibros();
  }

  loadLibros() {
    this.librosService.findWithFilters(1).subscribe((res) => {
      if (res.ok) {
        this.totalBooks = res.total;
      }
    });
  }

  goTo() {
    this.router.navigateByUrl('books/0/edit');
  }

  iniciarSesion() {
    this.router.navigate(['/auth']);
  }

  cerrarSesion() {
    this.alertService.loader();
    this.authService.logout().then((res) => {
      this.alertService.successOrError(
        'Operación Exitosa!',
        'Sesión Cerrada!',
        'success'
      );
      window.location.reload();
    });
  }
}
