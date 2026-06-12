import { Injectable, signal, inject } from '@angular/core';
import { LogStateService } from './log-state.service';
import { LogstreamEntry, ConnectionStatus } from '../models/logstream.model';

const WS_URL = 'ws://localhost:3000';
const RECONNECT_DELAY = 3000;

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private logState = inject(LogStateService);

  latestEntry = signal<LogstreamEntry | null>(null);
  status = signal<ConnectionStatus>('disconnected');
  statusMessage = signal('');

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
      this.updateStatus('connected');
      if (this.wasDisconnected) {
        window.location.reload();
      }
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.ws.onclose = () => {
      this.ws = null;
      this.updateStatus('disconnected');
      this.wasDisconnected = true;
      this.showBanner('Device disconnected. Reconnecting...');
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      this.ws?.close();
    };
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  scheduleReconnect(): void {
    if (this.reconnectTimer) {
      return;
    }
    this.updateStatus('reconnecting');
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
      this.logState.appendEntry(entry);
      this.latestEntry.set(entry);
    } else if (msg['type'] === 'status') {
      const text = String(msg['message'] || '');
      if (text) {
        this.showBanner(text);
      }
    }
  }

  private updateStatus(status: ConnectionStatus): void {
    this.status.set(status);
    this.logState.setConnectionStatus(status);
  }

  private showBanner(text: string): void {
    this.statusMessage.set(text);
  }

  dismissBanner(): void {
    this.statusMessage.set('');
  }
}
