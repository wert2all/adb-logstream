import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { streamActions } from '../../store/stream/stream.actions';
import { streamFeature } from '../../store/stream/stream.redusers';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {
  private store = inject(Store);
  protected query = this.store.selectSignal(streamFeature.selectQueryString);
  protected searchQuery = this.store.selectSignal(streamFeature.selectQueryString);

  onInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.store.dispatch(streamActions.setQuery({ query }));
  }

  clearSearch(): void {
    document.getElementById('search-input')?.blur();
    this.store.dispatch(streamActions.cleanQuery());
  }
}
