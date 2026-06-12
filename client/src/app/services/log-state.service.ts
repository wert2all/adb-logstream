import { Injectable, signal, computed } from '@angular/core';
import { LogstreamEntry, ConnectionStatus } from '../models/logstream.model';

const MAX_ENTRIES = 5000;

@Injectable({ providedIn: 'root' })
export class LogStateService {
  entries = signal<LogstreamEntry[]>([]);
  levelFilters = signal<Record<string, boolean>>({
    V: false,
    D: true,
    I: true,
    W: true,
    E: true,
    F: true,
  });
  searchQuery = signal('');
  connectionStatus = signal<ConnectionStatus>('disconnected');
  totalReceived = signal(0);
  autoScrollEnabled = signal(true);

  getFilteredEntries = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const filters = this.levelFilters();
    return this.entries().filter((entry) => {
      const levelVisible = filters[entry.level] !== false;
      if (!levelVisible) return false;
      if (!query) return true;
      const text = (entry.tag + ' ' + entry.message).toLowerCase();
      return text.includes(query);
    });
  });

  appendEntry(entry: LogstreamEntry): void {
    this.entries.update((current) => {
      const updated = [...current, entry];
      if (updated.length > MAX_ENTRIES) {
        updated.shift();
      }
      return updated;
    });
    this.totalReceived.update((n) => n + 1);
  }

  clearLog(): void {
    this.entries.set([]);
    this.totalReceived.set(0);
  }

  toggleLevel(level: string): void {
    this.levelFilters.update((filters) => ({
      ...filters,
      [level]: !filters[level],
    }));
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  setAutoScroll(enabled: boolean): void {
    this.autoScrollEnabled.set(enabled);
  }

  setConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus.set(status);
  }
}
