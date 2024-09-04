import { Routes } from '@angular/router';
import { ProductListPageComponent } from './products/pages/product-list-page/product-list-page.component';
import { NotFoundPageComponent } from './products/pages/not-found-page/not-found-page.component';
import { ProductDetailsPageComponent } from './products/pages/product-details-page/product-details-page.component';

export const routes: Routes = [
  {
    path: 'products/:page',
    title: 'Products',
    component: ProductListPageComponent,
  },
  {
    path: 'product/:id',
    title: 'Product Details',
    component: ProductDetailsPageComponent,
  },
  {
    path: 'products',
    redirectTo: 'products/1',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: '/products/1',
    pathMatch: 'full',
  },
  {
    path: '**',
    title: 'Not Found',
    component: NotFoundPageComponent,
  },
];
