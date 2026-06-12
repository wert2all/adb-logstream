export interface LogstreamEntry {
  timestamp: string;
  pid: string;
  tid: string;
  level: 'V' | 'D' | 'I' | 'W' | 'E' | 'F';
  tag: string;
  message: string;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';
