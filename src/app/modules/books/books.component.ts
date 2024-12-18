import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'src/shared/services/book.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent {
  totalBooks = 0;

  constructor(private router: Router, private bookService: BookService) {
    this.bookService.getTotalBooks().then((res) => {
      if (res) {
        this.totalBooks = res;
      }
    });
  }

  goTo() {
    this.router.navigateByUrl('books/0/edit');
  }
}
