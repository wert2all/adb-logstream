import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ConnectionStatus, LevelFilter, LogEntry } from './stream.types';
import { KeyboardShortcut, Level, Undefined } from '../../app.types';

export const streamActions = createActionGroup({
  source: 'stream',
  events: {
    'set application state from storage': props<{
      filters: LevelFilter | Undefined;
      autoScroll: boolean;
    }>(),
    'clean filters': emptyProps(),
    'toggle autoscroll': emptyProps(),
    'set autoscroll': props<{ enabled: boolean }>(),

    'set query': props<{ query: string }>(),
    'clean query': emptyProps(),

    'toggle level': props<{ level: Level }>(),

    'key pressed': props<{ key: KeyboardShortcut }>(),
    'no shortcut key pressed': emptyProps(),

    'copy selected entries': emptyProps(),

    'copy selected': emptyProps(),
    'empty selection': emptyProps(),
    copied: emptyProps(),
    'copy failed': emptyProps(),
    'append entry': props<{ entry: LogEntry }>(),

    'set connection status': props<{ status: ConnectionStatus }>(),

    'toggle selection': props<{ uuid: string }>(),

    'set package filter': props<{ query: string }>(),
    'clean package filter': emptyProps(),
  },
});
