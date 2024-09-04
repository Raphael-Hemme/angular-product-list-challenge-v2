import { Injectable } from '@angular/core';

export type ProductListEntryData = {
  id: number;
  title: string;
  brand: string;
  price: number;
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}
}
