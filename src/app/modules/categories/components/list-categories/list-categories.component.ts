import { Component, OnInit } from '@angular/core';
import { categories } from 'src/shared/tips-select/types-select';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.css'],
})
export class ListCategoriesComponent implements OnInit {
  categories = categories;

  constructor() {}

  ngOnInit() {}
}
