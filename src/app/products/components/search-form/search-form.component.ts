import {
  AfterViewInit,
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
import { NavigationService } from '../../../core/services/navigation/navigation.service';

@Component({
  selector: 'app-search-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss'
})
export class SearchFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() isSplashPageSearch = false;

  public searchForm!: FormGroup;

  private searchSub: Subscription = new Subscription();

  constructor(
    private readonly fb: FormBuilder,
    private readonly productListService: ProductListService,
    private readonly productListSearchService: ProductListSearchService,
    private readonly navigationService: NavigationService
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
            if (!value || value.length === 0) {
              this.clearSearch();
            }
          }),
          filter((value) => value && value.length > 0),
          tap((value) => this.productListSearchService.currSearchTerm.set(value)),
          tap((value) => this.triggerSearchNavigation(value))
        )
        .subscribe()
    );
  }

  ngAfterViewInit(): void {
    // Update the input once initially but after view initialization with the potentially
    // available search tearm that was provided via query params and updated in the ProductListSearchService signal
    this.updateSearchInput();
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
    this.navigationService.resetUrlFromSearchToDefaultMode();
  }

  private triggerSearchNavigation(searchTerm: string): void {
    this.navigationService.navigateToSearchUrl(searchTerm);
  }

  private updateSearchInput(): void {
    const searchFormControl = this.searchForm.get('search');
    const currSearchTermValue = this.productListSearchService.currSearchTerm();
    if (!searchFormControl?.value && currSearchTermValue) {
      searchFormControl?.setValue(currSearchTermValue);
    }
  }
}
