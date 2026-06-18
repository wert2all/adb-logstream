import { Level, Undefined } from '../../app.types';

export type LogEntry = {
  uuid: string;
  level: Level;
  message: string;
  timestamp: string;
  pid: string;
  tid: string;
  tag: string;
  packageName: string | null;
};
export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';
export type LevelFilter = Record<Level, boolean>;
export type Filters = { query: string | Undefined; levels: LevelFilter };
export type StreamState = {
  filters: Filters;
  autoScroll: boolean;
  selected: LogEntry[];
  entries: LogEntry[];
  totalReceived: number;
  connectionStatus: ConnectionStatus;
  packageFilter: string | null;
};
