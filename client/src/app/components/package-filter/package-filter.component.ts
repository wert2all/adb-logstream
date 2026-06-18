import { Component, inject, DestroyRef, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { streamActions } from '../../store/stream/stream.actions';
import { streamFeature } from '../../store/stream/stream.reducers';

@Component({
  selector: 'app-package-filter',
  standalone: true,
  templateUrl: './package-filter.component.html',
})
export class PackageFilterComponent {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private query$ = new Subject<string>();

  protected packageNames = this.store.selectSignal(streamFeature.selectPackageNames);
  protected packageFilter = this.store.selectSignal(streamFeature.selectPackageFilter);

  constructor() {
    this.query$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => {
        this.store.dispatch(streamActions.setPackageFilter({ query }));
      });
  }

  onInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.query$.next(query);
  }

  clearFilter(): void {
    (document.getElementById('package-filter-input') as HTMLInputElement)?.blur();
    this.query$.next('');
    this.store.dispatch(streamActions.cleanPackageFilter());
  }
}
