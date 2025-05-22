import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookService } from './services/book.service';

//Firebase Modulo
import { environment } from 'src/environments/environment';
import { AlertService } from './services/alert.service';
import { TitleComponent } from './components/title/title.component';

import { initializeApp } from 'firebase/app';
import 'firebase/auth'; // Si vas a usar autenticación
import 'firebase/firestore'; // Si vas a usar Firestore
import 'firebase/storage'; // Si vas a usar almacenamiento

initializeApp(environment.firebaseConfig);

import { NgOptimizedImage } from '@angular/common';
import { AuthService } from './services/auth.service';
import { LibroService } from './services/libro.service';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgOptimizedImage,
  ],
  declarations: [ButtonComponent, TitleComponent, ],
  exports: [
    ButtonComponent,
    TitleComponent,
    ReactiveFormsModule,
    FormsModule,
    NgOptimizedImage,
    HttpClientModule
  ],
  providers: [BookService, AlertService, AuthService, LibroService,AuthGuard,LoginGuard],
})
export class SharedModule {}
