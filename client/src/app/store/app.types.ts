import { Level, Undefined } from '../app.types';

export type StorageFilter = {
  levels: LevelFilter;
};

export type LevelFilter = Record<Level, boolean>;
export type Filters = { query: string | Undefined; levels: LevelFilter };
export type AppState = {
  filters: Filters;
  autoScroll: boolean;
};
