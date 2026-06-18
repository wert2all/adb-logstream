import { Component, HostListener, inject, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/websocket.service';
import { HeaderComponent } from '../header/header.component';
import { LogListComponent } from '../log-list/log-list.component';
import { FooterComponent } from '../footer/footer.component';
import { Store } from '@ngrx/store';
import { KeyboardShortcut, KeyboardShortcuts } from '../../app.types';
import { streamActions } from '../../store/stream/stream.actions';
import { NotificationBannerComponent } from '../notification-banner/notification-banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, LogListComponent, FooterComponent, NotificationBannerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private store = inject(Store);
  private webSocket: WebSocketService = inject(WebSocketService);

  ngOnInit(): void {
    // Connect WebSocket
    this.webSocket.connect();
  }

  private isShortcut(key: string): key is KeyboardShortcut {
    return KeyboardShortcuts.includes(key as KeyboardShortcut);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const isFormField =
      target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    const key = event.key.toLocaleLowerCase();
    if (this.isShortcut(key)) {
      // Allow Escape to work everywhere (clears search / blurs input)
      // All other shortcuts: skip when user is typing in a form field
      if (isFormField && key !== 'escape') {
        return;
      }

      this.store.dispatch(streamActions.keyPressed({ key }));
      event.preventDefault();
      if (key === '/') {
        document.getElementById('search-input')?.focus();
      } else if (key === '.') {
        document.getElementById('package-filter-input')?.focus();
      }
    }
  }
}
