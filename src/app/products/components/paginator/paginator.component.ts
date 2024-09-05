import { Component, computed, Signal, WritableSignal } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ProductListService } from '../../../core/services/product-list/product-list.service';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  public length = 100;
  public pageSize = 20;
  public disabled = false;
  public pageIndex!: Signal<number>;

  constructor(private productListServece: ProductListService) {
    this.pageIndex = computed(
      () => this.productListServece.currPageNumber() - 1,
    );
  }

  public handlePageEvent(event: PageEvent): void {
    console.log(event);
  }
}
