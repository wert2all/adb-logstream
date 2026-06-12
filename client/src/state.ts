export interface LogstreamEntry {
  timestamp: string;
  pid: string;
  tid: string;
  level: 'V' | 'D' | 'I' | 'W' | 'E' | 'F';
  tag: string;
  message: string;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';

export interface AppState {
  entries: LogstreamEntry[];
  levelFilters: Record<string, boolean>;
  searchQuery: string;
  connectionStatus: ConnectionStatus;
  totalReceived: number;
  autoScrollEnabled: boolean;
}

export function createAppState(): AppState {
  return {
    entries: [],
    levelFilters: {
      V: false,
      D: true,
      I: true,
      W: true,
      E: true,
      F: true,
    },
    searchQuery: '',
    connectionStatus: 'disconnected',
    totalReceived: 0,
    autoScrollEnabled: true,
  };
}

export const state = createAppState();

export function loadAutoScrollState(): void {
  try {
    const stored = localStorage.getItem('logstream-auto-scroll-enabled');
    if (stored !== null) {
      state.autoScrollEnabled = stored === 'true';
    }
  } catch {
    // localStorage unavailable — use default
  }
}

export function saveAutoScrollState(): void {
  try {
    localStorage.setItem('logstream-auto-scroll-enabled', String(state.autoScrollEnabled));
  } catch {
    // localStorage unavailable — silently ignore
  }
}
