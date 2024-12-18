import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from './services/database.service';
import { ButtonComponent } from './components/button/button.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookService } from './services/book.service';

//Firebase Modulo
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from 'src/environments/environment';
import { AlertService } from './services/alert.service';
import { TitleComponent } from './components/title/title.component';

import { NgOptimizedImage } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    NgOptimizedImage,
  ],
  declarations: [ButtonComponent, TitleComponent],
  exports: [
    ButtonComponent,
    TitleComponent,
    ReactiveFormsModule,
    AngularFirestoreModule,
    FormsModule,
    NgOptimizedImage,
  ],
  providers: [DatabaseService, BookService, AlertService],
})
export class SharedModule {}
