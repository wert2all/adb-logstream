import { Component, inject } from '@angular/core';
import { LogStateService } from '../../services/log-state.service';
import { WebSocketService } from '../../services/websocket.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { LevelTogglesComponent } from '../level-toggles/level-toggles.component';
import { Store } from '@ngrx/store';
import { appActions } from '../../store/app.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBarComponent, LevelTogglesComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private store = inject(Store);
  logState = inject(LogStateService);
  webSocket = inject(WebSocketService);

  clearFilters(): void {
    this.store.dispatch(appActions.cleanFilters());
    this.logState.clearLog();
  }

  copyLogs(): void {
    this.logState.copySelected();
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
