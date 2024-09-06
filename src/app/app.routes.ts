import { Routes } from '@angular/router';
import { ProductListPageComponent } from './products/pages/product-list-page/product-list-page.component';
import { NotFoundPageComponent } from './products/pages/not-found-page/not-found-page.component';
import { ProductDetailsPageComponent } from './products/pages/product-details-page/product-details-page.component';

export const routes: Routes = [
  {
    path: 'products',
    title: 'Products',
    component: ProductListPageComponent,
  },
  {
    path: 'product',
    title: 'Product Details',
    component: ProductDetailsPageComponent,
  },
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
  {
    path: '404',
    title: 'Not Found',
    component: NotFoundPageComponent,
  },
  {
    path: '**',
    title: 'Not Found',
    component: NotFoundPageComponent,
  },
];
