import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { StorageFilter } from './app.types';
import { Undefined } from '../app.types';

export const appActions = createActionGroup({
  source: 'app',
  events: {
    'set application state from storage': props<{
      filters: StorageFilter | Undefined;
      autoScroll: boolean;
    }>(),
    'clean filters': emptyProps(),
    'toggle autoscroll': emptyProps(),
    'set autoscroll': props<{ enabled: boolean }>(),

    'set query': props<{ query: string }>(),
    'clean query': emptyProps(),
  },
});
