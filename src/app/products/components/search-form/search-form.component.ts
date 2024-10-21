import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Subscription,
  tap
} from 'rxjs';
import { NgClass } from '@angular/common';
import { ProductListSearchService } from '../../../core/services/product-list-search/product-list-search.service';
import { ProductListService } from '../../../core/services/product-list/product-list.service';

@Component({
  selector: 'app-search-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss'
})
export class SearchFormComponent implements OnInit, OnDestroy {
  @Input() isSplashPageSearch = false;

  public searchForm!: FormGroup;

  private searchSub: Subscription = new Subscription();

  constructor(
    private readonly fb: FormBuilder,
    private readonly productListService: ProductListService,
    private readonly productListSearchService: ProductListSearchService
  ) {
    this.searchForm = this.fb.group({
      search: [this.productListSearchService.currSearchTerm()]
    });
  }

  ngOnInit(): void {
    this.searchSub.add(
      // prettier-ignore
      this.searchForm!.get('search')!.valueChanges
        .pipe(
          // prettier-ignore
          debounceTime(500),
          // prettier-ignore
          distinctUntilChanged(),
          // The following side effect is used to clear the search results when the search input
          // is emptied with the keyboard and not with the clear button.
          tap((value) => {
            if (value.length === 0) {
              this.productListSearchService.clearSearchResults();
            }
          }),
          filter((value) => value.length > 0),
          tap((value) => this.productListSearchService.currSearchTerm.set(value)),
          tap((value) => this.searchProducts(value))
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
    if (!this.isSplashPageSearch) {
      this.clearSearch();
    }
  }

  public clearSearch(): void {
    this.searchForm!.get('search')!.setValue('');
    this.productListSearchService.clearSearchResults();
    this.productListService.changeMode('RAW');
  }

  private searchProducts(searchTerm: string): void {
    this.productListService.changeMode('SEARCH');
    console.log('searching for: ', searchTerm);
    this.productListSearchService.searchProducts(searchTerm);
  }
}
