export interface LogcatEntry {
  timestamp: string;
  pid: number;
  tid: number;
  level: "V" | "D" | "I" | "W" | "E" | "F";
  tag: string;
  message: string;
}

export type ConnectionStatus = "connected" | "disconnected" | "reconnecting";

export interface AppState {
  entries: LogcatEntry[];
  levelFilters: Record<string, boolean>;
  searchQuery: string;
  connectionStatus: ConnectionStatus;
  totalReceived: number;
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
    searchQuery: "",
    connectionStatus: "disconnected",
    totalReceived: 0,
  };
}

export const state = createAppState();
