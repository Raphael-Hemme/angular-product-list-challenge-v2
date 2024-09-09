import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Subscription,
  tap
} from 'rxjs';
import { ProductListService } from '../../../core/services/product-list/product-list.service';

@Component({
  selector: 'app-search-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss'
})
export class SearchFormComponent implements OnInit {
  public searchForm!: FormGroup;

  private searchSub: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private readonly productListService: ProductListService
  ) {
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  ngOnInit(): void {
    this.searchSub.add(
      // prettier-ignore
      this.searchForm!.get('search')!.valueChanges
        .pipe(
          // prettier-ignore
          debounceTime(1000),
          // prettier-ignore
          distinctUntilChanged(),
          // The following side effect is used to clear the search results when the search input
          // is emptied via backspace / delete and not via the clear button.
          tap((value) => {
            if (value.length === 0) {
              this.productListService.clearSearchResults();
            }
          }),
          filter((value) => value.length > 0),
          tap((value) => this.searchProducts(value))
        )
        .subscribe()
    );
  }

  public clearSearch(): void {
    this.searchForm!.get('search')!.setValue('');
    this.productListService.clearSearchResults();
  }

  private searchProducts(searchTerm: string): void {
    this.productListService.searchProducts(searchTerm);
  }
}
