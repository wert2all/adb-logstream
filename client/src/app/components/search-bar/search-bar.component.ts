import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { streamActions } from '../../store/stream/stream.actions';
import { streamFeature } from '../../store/stream/stream.reducers';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private query$ = new Subject<string>();

  protected query = this.store.selectSignal(streamFeature.selectQueryString);
  protected searchQuery = this.store.selectSignal(streamFeature.selectQueryString);

  constructor() {
    this.query$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((query) => {
        this.store.dispatch(streamActions.setQuery({ query }));
      });
  }

  onInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.query$.next(query);
  }

  clearSearch(): void {
    document.getElementById('search-input')?.blur();
    this.query$.next('');
    this.store.dispatch(streamActions.cleanQuery());
  }
}
