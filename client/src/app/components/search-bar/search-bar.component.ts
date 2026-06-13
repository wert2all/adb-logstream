import { Component, inject } from '@angular/core';
import { LogStateService } from '../../services/log-state.service';
import { Store } from '@ngrx/store';
import { appActions } from '../../store/app.actions';
import { appFeature } from '../../store/app.redusers';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {
  private store = inject(Store);
  protected query = this.store.selectSignal(appFeature.selectQueryString);

  logState = inject(LogStateService);

  onInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.logState.setSearchQuery(query);

    this.store.dispatch(appActions.setQuery({ query }));
  }

  clearSearch(): void {
    this.logState.setSearchQuery('');
    document.getElementById('search-input')?.blur();

    this.store.dispatch(appActions.cleanQuery());
  }
}
