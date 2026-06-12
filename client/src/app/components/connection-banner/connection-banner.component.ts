import { Component, inject } from '@angular/core';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-connection-banner',
  standalone: true,
  templateUrl: './connection-banner.component.html',
})
export class ConnectionBannerComponent {
  webSocket = inject(WebSocketService);

  dismiss(): void {
    this.webSocket.dismissBanner();
  }
}
