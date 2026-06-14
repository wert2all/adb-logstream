import { inject } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { map, tap } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { streamActions } from './stream.actions';
import { DispatchEffect, KeyboardShortcut, NonDispatchEffect } from '../../app.types';
import { Store } from '@ngrx/store';
import { streamFeature } from './stream.redusers';
import { concatLatestFrom } from '@ngrx/operators';

function exposeActionFromKeyPressed(key: KeyboardShortcut) {
  switch (key) {
    case 'Escape':
      return streamActions.cleanQuery();
    case 'c':
      return streamActions.cleanFilters();
    case 'v':
      return streamActions.toggleLevel({ level: 'V' });
    case 'd':
      return streamActions.toggleLevel({ level: 'D' });
    case 'i':
      return streamActions.toggleLevel({ level: 'I' });
    case 'w':
      return streamActions.toggleLevel({ level: 'W' });
    case 'e':
      return streamActions.toggleLevel({ level: 'E' });
    case 'f':
      return streamActions.toggleLevel({ level: 'F' });
    case 'a':
      return streamActions.toggleAutoscroll();
    default:
      return streamActions.noShortcutKeyPressed();
  }
}

export const initStateFromStorage = (
  actions$ = inject(Actions),
  localStorage = inject(LocalStorageService),
) =>
  actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(() => ({
      filters: localStorage.loadFilters(),
      autoScroll: localStorage.loadAutoScroll(),
    })),
    map(({ filters, autoScroll }) =>
      streamActions.setApplicationStateFromStorage({
        filters: filters,
        autoScroll: autoScroll === null ? true : autoScroll,
      }),
    ),
  );

export const cleanFilters = (
  actions$ = inject(Actions),
  localStorage = inject(LocalStorageService),
) =>
  actions$.pipe(
    ofType(streamActions.cleanFilters),
    tap(() => {
      localStorage.cleanFilters();
    }),
  );

export const toggleAutoScroll = (actions$ = inject(Actions), store = inject(Store)) =>
  actions$.pipe(
    ofType(streamActions.toggleAutoscroll),
    concatLatestFrom(() => store.select(streamFeature.selectAutoScroll)),
    map(([_, autoScroll]) => streamActions.setAutoscroll({ enabled: !autoScroll })),
  );

export const setAutoscroll = (
  actions$ = inject(Actions),
  localStorage = inject(LocalStorageService),
) =>
  actions$.pipe(
    ofType(streamActions.setAutoscroll),
    tap(({ enabled }) => {
      localStorage.saveAutoScroll(enabled);
    }),
  );

export const toggleLevelFilter = (
  actions$ = inject(Actions),
  store = inject(Store),
  localStorage = inject(LocalStorageService),
) =>
  actions$.pipe(
    ofType(streamActions.toggleLevel),
    concatLatestFrom(() => store.select(streamFeature.selectLevelFilters)),
    tap(([_, filters]) => localStorage.saveFilters(filters)),
  );

export const keyPressed = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(streamActions.keyPressed),
    map(({ key }) => exposeActionFromKeyPressed(key)),
  );

export const streamEffects = {
  initStateFromStorage: createEffect(initStateFromStorage, DispatchEffect),
  cleanFilters: createEffect(cleanFilters, NonDispatchEffect),
  toggleAutoScroll: createEffect(toggleAutoScroll, DispatchEffect),
  setAutoScroll: createEffect(setAutoscroll, NonDispatchEffect),
  toggleLevelFilter: createEffect(toggleLevelFilter, NonDispatchEffect),
  keyPressed: createEffect(keyPressed, DispatchEffect),
};
