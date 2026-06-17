import { Injectable, signal, inject } from '@angular/core';
import { LogstreamEntry } from '../models/logstream.model';
import { Store } from '@ngrx/store';
import { notificationActions } from '../store/notification/notification.actions';
import { streamActions } from '../store/stream/stream.actions';

const WS_URL = 'ws://localhost:3000';
const RECONNECT_DELAY = 3000;

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private store = inject(Store);
  private latestEntry = signal<LogstreamEntry | null>(null);

  private ws: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private wasDisconnected = false;

  connect(): void {
    if (this.ws) {
      return;
    }

    try {
      this.ws = new WebSocket(WS_URL);
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.store.dispatch(streamActions.setConnectionStatus({ status: 'connected' }));
      this.store.dispatch(streamActions.setConnectionStatus({ status: 'connected' }));
      if (this.wasDisconnected) {
        window.location.reload();
      }
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.ws.onclose = () => {
      this.ws = null;
      this.store.dispatch(streamActions.setConnectionStatus({ status: 'disconnected' }));
      this.wasDisconnected = true;
      this.store.dispatch(
        notificationActions.showMessage({
          messageType: 'error',
          message: 'Device disconnected. Reconnecting...',
        }),
      );
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      this.ws?.close();
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      return;
    }
    this.store.dispatch(streamActions.setConnectionStatus({ status: 'reconnecting' }));
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, RECONNECT_DELAY);
  }

  private handleMessage(data: string): void {
    let message: unknown;
    try {
      message = JSON.parse(data);
    } catch {
      console.error('Malformed JSON received:', data);
      return;
    }

    if (!message || typeof message !== 'object') {
      return;
    }

    const msg = message as Record<string, unknown>;

    if (msg['type'] === 'entry') {
      const entry: LogstreamEntry = {
        uuid: String(msg['uuid'] || ''),
        timestamp: String(msg['timestamp'] || ''),
        pid: String(msg['pid'] || ''),
        tid: String(msg['tid'] || ''),
        level: String(msg['level'] || 'I') as LogstreamEntry['level'],
        tag: String(msg['tag'] || ''),
        message: String(msg['message'] || ''),
      };
      this.store.dispatch(streamActions.appendEntry({ entry }));
      this.latestEntry.set(entry);
    } else if (msg['type'] === 'status') {
      const text = String(msg['message'] || '');
      if (text) {
        this.store.dispatch(
          notificationActions.showMessage({
            messageType: 'error',
            message: text,
          }),
        );
      }
    }
  }
}
