import { Component, inject } from '@angular/core';
import { LogStateService } from '../../services/log-state.service';
import { WebSocketService } from '../../services/websocket.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { LevelTogglesComponent } from '../level-toggles/level-toggles.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBarComponent, LevelTogglesComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  logState = inject(LogStateService);
  webSocket = inject(WebSocketService);

  clearLogs(): void {
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
