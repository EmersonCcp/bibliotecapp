import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/shared/interfaces/book.interface';
import { AlertService } from 'src/shared/services/alert.service';
import { BookService } from 'src/shared/services/book.service';

import {
  authors,
  categories,
} from '../../../../../shared/tips-select/types-select';

@Component({
  selector: 'app-guardar-book',
  templateUrl: './guardar-book.component.html',
  styleUrls: ['./guardar-book.component.css'],
})
export class GuardarBookComponent implements OnInit {
  bookForm: FormGroup;
  mod = 'edit';
  authors = authors;
  categories = categories;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private location: Location,
    private alertService: AlertService
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: [''],
      description: [''],
      urlImage: [''],
      urlFile: [''],
      publishedDate: [''],
      category: [''],
    });

    this.categories.sort((a, b) =>
      a.localeCompare(b, 'es', { sensitivity: 'base' })
    );
    this.authors.sort((a, b) =>
      a.localeCompare(b, 'es', { sensitivity: 'base' })
    );
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe((param) => {
      if (param['mod'] == 'view') {
        this.bookForm.disable();
        this.mod == 'view';
      }
      if (param['id']) {
        let id = param['id'];

        this.bookService.getBookById(id).then((res) => {
          if (res) {
            this.bookForm.patchValue(res);
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.alertService.loader();
      const newBook: Book = this.bookForm.value;
      this.bookService.addBook(newBook).then((res) => {
        if (res) {
          this.router.navigateByUrl('books');
          this.alertService.close();
        }
      });
    }
  }

  goToBack() {
    this.location.back();
  }
}
