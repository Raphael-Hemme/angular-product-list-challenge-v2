import { Routes } from '@angular/router';
import { ProductListPageComponent } from './products/pages/product-list-page/product-list-page.component';
import { NotFoundPageComponent } from './products/pages/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductListPageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
