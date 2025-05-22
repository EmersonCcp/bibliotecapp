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
import { ILibro } from 'src/shared/interfaces/libro.interface';
import { LibroService } from 'src/shared/services/libro.service';

@Component({
  selector: 'app-guardar-book',
  templateUrl: './guardar-book.component.html',
  styleUrls: ['./guardar-book.component.css'],
})
export class GuardarBookComponent implements OnInit {
  form: FormGroup
  mod = 'edit';
  authors = authors;
  categories = categories;
  id = 0;

  libro!: ILibro;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private location: Location,
    private alertService: AlertService,
    private librosService: LibroService
  ) {
    this.form = this.fb.group({
      libr_titulo: ['', [Validators.required]],
      libr_autor: [null],
      libr_descripcion: [null],
      libr_urlImagen: ['', Validators.required],
      libr_urlFile: ['', Validators.required],
      libr_categoria: ['', Validators.required],
      libr_estado: [true]
    })

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
        this.form.disable();
        this.mod == 'view';
      }
      if (param['id']) {
        let id = param['id'];
        this.id = param['id'] !== '0' ? Number(param['id']) : 0;

        this.librosService.findOne(this.id).subscribe(res => {
          if(res.ok) {
            this.libro = res.item;
            this.form.patchValue(res.item);
          }
        });
        
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.alertService.loader();
      const newLibro: ILibro = this.form.value;
      
      if (this.id !== 0) {
        this.librosService.update(this.id, newLibro).subscribe(res => {
          if (res.ok) {
            this.alertService.successOrError(
              'Operación Exitosa!',
              'Libro guardado',
              'success'
            );
            this.router.navigateByUrl('books');
          } else {
            this.alertService.successOrError(
              'Ocurrió un Error!',
              res.message,
              'error'
            );
          }
        });
      } else {
        this.librosService.create(newLibro).subscribe((res) => {
          if (res.ok) {
            this.alertService.successOrError(
              'Operación Exitosa!',
              'Libro guardado',
              'success'
            );
            this.router.navigateByUrl('books');
          } else {
            this.alertService.successOrError(
              'Ocurrió un Error!',
              res.message,
              'error'
            );
          }
        });
      }
    }
  }

  goToBack() {
    this.location.back();
  }
}
