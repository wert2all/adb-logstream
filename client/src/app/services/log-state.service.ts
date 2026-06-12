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
  selectedUuids = signal<Set<string>>(new Set());
  copyFeedback = signal<{ message: string; visible: boolean } | null>(null);

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

  getSelectedEntries = computed(() => {
    const selected = this.selectedUuids();
    return this.entries().filter((entry) => selected.has(entry.uuid));
  });

  hasSelection = computed(() => this.selectedUuids().size > 0);

  isSelected(uuid: string): boolean {
    return this.selectedUuids().has(uuid);
  }

  toggleSelection(uuid: string): void {
    this.selectedUuids.update((set) => {
      const next = new Set(set);
      if (next.has(uuid)) {
        next.delete(uuid);
      } else {
        next.add(uuid);
      }
      return next;
    });
  }

  clearSelection(): void {
    this.selectedUuids.set(new Set());
  }

  async copySelected(): Promise<void> {
    const selected = this.getSelectedEntries();
    if (selected.length === 0) return;

    const json = JSON.stringify(selected, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      this.clearSelection();
      this.showCopyFeedback('Copied!');
    } catch {
      this.showCopyFeedback('Copy failed');
    }
  }

  private showCopyFeedback(message: string): void {
    this.copyFeedback.set({ message, visible: true });
    setTimeout(() => {
      this.copyFeedback.set(null);
    }, 2000);
  }

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
    this.clearSelection();
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

  setConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus.set(status);
  }
}
