import { Component, inject } from '@angular/core';
import { LogStateService } from '../../services/log-state.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {
  logState = inject(LogStateService);

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.logState.setSearchQuery(value);
  }

  clearSearch(): void {
    this.logState.setSearchQuery('');
    document.getElementById('search-input')?.blur();
  }
}
