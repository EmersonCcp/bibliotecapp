import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/shared/services/alert.service';
import { AuthService } from 'src/shared/services/auth.service';
import { BookService } from 'src/shared/services/book.service';

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
    private alertService: AlertService
  ) {
    this.authService.waitForAuthState().then((user) => {
      if (user) {
        this.admin = true;
      }
    });
    this.bookService.getTotalBooks().then((res) => {
      if (res) {
        this.totalBooks = res;
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
    this.authService.signOut().then((res) => {
      this.alertService.successOrError(
        'Operación Exitosa!',
        'Sesión Cerrada!',
        'success'
      );
      window.location.reload();
    });
  }
}
