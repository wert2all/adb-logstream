import { Level, Undefined } from '../../app.types';

export type LevelFilter = Record<Level, boolean>;
export type Filters = { query: string | Undefined; levels: LevelFilter };
export type StreamState = {
  filters: Filters;
  autoScroll: boolean;
};
