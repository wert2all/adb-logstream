export interface LogstreamEntry {
  uuid: string;
  timestamp: string;
  pid: string;
  tid: string;
  level: 'V' | 'D' | 'I' | 'W' | 'E' | 'F';
  tag: string;
  message: string;
  packageName: string | null;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';
