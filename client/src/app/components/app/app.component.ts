import { Component, effect, HostListener, inject, OnInit } from '@angular/core';
import { LogStateService } from '../../services/log-state.service';
import { WebSocketService } from '../../services/websocket.service';
import { HeaderComponent } from '../header/header.component';
import { LogListComponent } from '../log-list/log-list.component';
import { FooterComponent } from '../footer/footer.component';
import { Store } from '@ngrx/store';
import { KeyboardShortcut, KeyboardShortcuts } from '../../app.types';
import { streamActions } from '../../store/stream/stream.actions';
import { NotficationBannerComponent } from '../notification-banner/notification-banner.component';
import { notificationActions } from '../../store/notification/notification.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, LogListComponent, FooterComponent, NotficationBannerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private store = inject(Store);
  private webSocket: WebSocketService = inject(WebSocketService);

  constructor() {
    effect(() => {
      const message = this.webSocket.statusMessage();
      if (message) {
        this.store.dispatch(notificationActions.showMessage({ messageType: 'error', message }));
      }
    });
  }

  ngOnInit(): void {
    // Connect WebSocket
    this.webSocket.connect();
  }

  private isShortcut(key: string): key is KeyboardShortcut {
    return KeyboardShortcuts.includes(key as KeyboardShortcut);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLocaleLowerCase();
    if (this.isShortcut(key)) {
      this.store.dispatch(streamActions.keyPressed({ key }));
      event.preventDefault();
      if (key === '/') {
        document.getElementById('search-input')?.focus();
      }
    }
  }
}
