import { Component, HostListener, inject, OnInit } from '@angular/core';
import { LogStateService } from '../../services/log-state.service';
import { WebSocketService } from '../../services/websocket.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { HeaderComponent } from '../header/header.component';
import { ConnectionBannerComponent } from '../connection-banner/connection-banner.component';
import { LogListComponent } from '../log-list/log-list.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, ConnectionBannerComponent, LogListComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private logState: LogStateService = inject(LogStateService);
  private webSocket: WebSocketService = inject(WebSocketService);
  private localStorage: LocalStorageService = inject(LocalStorageService);

  ngOnInit(): void {
    // Load persisted filters
    const savedFilters = this.localStorage.loadFilters();
    if (savedFilters) {
      this.logState.levelFilters.set(savedFilters);
    }

    // Connect WebSocket
    this.webSocket.connect();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

    if (isInput) {
      if (event.key === 'Escape') {
        this.logState.setSearchQuery('');
        event.preventDefault();
      }
      return;
    }

    switch (event.key) {
      case '/':
        event.preventDefault();
        document.getElementById('search-input')?.focus();
        break;
      case 'Escape':
        this.logState.setSearchQuery('');
        event.preventDefault();
        break;
      case 'c':
      case 'C':
        this.logState.clearLog();
        event.preventDefault();
        break;
      case 'v':
      case 'V':
        this.logState.toggleLevel('V');
        event.preventDefault();
        break;
      case 'd':
      case 'D':
        this.logState.toggleLevel('D');
        event.preventDefault();
        break;
      case 'i':
      case 'I':
        this.logState.toggleLevel('I');
        event.preventDefault();
        break;
      case 'w':
      case 'W':
        this.logState.toggleLevel('W');
        event.preventDefault();
        break;
      case 'e':
      case 'E':
        this.logState.toggleLevel('E');
        event.preventDefault();
        break;
      case 'f':
      case 'F':
        this.logState.toggleLevel('F');
        event.preventDefault();
        break;
    }
  }
}
