import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CategoryBooksComponent } from './category-books/category-books.component';
import { HomeComponent } from './home/home.component';
export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'books/:topic', component: CategoryBooksComponent },
  ];
