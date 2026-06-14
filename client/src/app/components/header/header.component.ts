import { Component, inject, signal } from '@angular/core';
import { LogStateService } from '../../services/log-state.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { LevelTogglesComponent } from '../level-toggles/level-toggles.component';
import { Store } from '@ngrx/store';
import { streamActions } from '../../store/stream/stream.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBarComponent, LevelTogglesComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private store = inject(Store);
  logState = inject(LogStateService);
  protected hasSelection = signal(this.logState.hasSelection());

  clearFilters(): void {
    this.store.dispatch(streamActions.cleanFilters());
  }

  copyLogs(): void {
    this.store.dispatch(streamActions.copySelected());
  }

  statusClass() {
    const status = this.logState.connectionStatus();
    switch (status) {
      case 'connected':
        return { dot: 'bg-secondary', text: 'text-secondary' };
      case 'disconnected':
        return { dot: 'bg-error', text: 'text-error' };
      case 'reconnecting':
        return { dot: 'bg-log-w', text: 'text-log-w' };
    }
  }

  statusLabel() {
    const status = this.logState.connectionStatus();
    switch (status) {
      case 'connected':
        return 'CONNECTED';
      case 'disconnected':
        return 'DISCONNECTED';
      case 'reconnecting':
        return 'RECONNECTING';
    }
  }
}
