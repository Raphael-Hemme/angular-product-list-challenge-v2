import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';

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

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  ngOnInit(): void {
    // prettier-ignore
    this.searchForm!.get('search')!.valueChanges
      .pipe(
        // prettier-ignore
        debounceTime(300),
        // prettier-ignore
        distinctUntilChanged(),
        // prettier-ignore
        tap((value) => console.log(value))
      )
      .subscribe();
  }

  public clearSearch(): void {
    this.searchForm!.get('search')!.setValue('');
  }
}
