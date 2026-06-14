import { inject } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { map, tap } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { appActions } from './app.actions';
import { DispatchEffect, KeyboardShortcut, NonDispatchEffect } from './../app.types';
import { Store } from '@ngrx/store';
import { appFeature } from './app.redusers';
import { concatLatestFrom } from '@ngrx/operators';

function exposeActionFromKeyPressed(key: KeyboardShortcut) {
  switch (key) {
    case 'Escape':
      return appActions.cleanQuery();
    case 'c':
      return appActions.cleanFilters();
    case 'v':
      return appActions.toggleLevel({ level: 'V' });
    case 'd':
      return appActions.toggleLevel({ level: 'D' });
    case 'i':
      return appActions.toggleLevel({ level: 'I' });
    case 'w':
      return appActions.toggleLevel({ level: 'W' });
    case 'e':
      return appActions.toggleLevel({ level: 'E' });
    case 'f':
      return appActions.toggleLevel({ level: 'F' });
    case 'a':
      return appActions.toggleAutoscroll();
    default:
      return appActions.noShortcutKeyPressed();
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
      appActions.setApplicationStateFromStorage({
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
    ofType(appActions.cleanFilters),
    tap(() => {
      localStorage.cleanFilters();
    }),
  );

export const toggleAutoScroll = (actions$ = inject(Actions), store = inject(Store)) =>
  actions$.pipe(
    ofType(appActions.toggleAutoscroll),
    concatLatestFrom(() => store.select(appFeature.selectAutoScroll)),
    map(([_, autoScroll]) => appActions.setAutoscroll({ enabled: !autoScroll })),
  );

export const setAutoscroll = (
  actions$ = inject(Actions),
  localStorage = inject(LocalStorageService),
) =>
  actions$.pipe(
    ofType(appActions.setAutoscroll),
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
    ofType(appActions.toggleLevel),
    concatLatestFrom(() => store.select(appFeature.selectLevelFilters)),
    tap(([_, filters]) => localStorage.saveFilters(filters)),
  );

export const keyPressed = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(appActions.keyPressed),
    map(({ key }) => exposeActionFromKeyPressed(key)),
  );

export const appEffects = {
  initStateFromStorage: createEffect(initStateFromStorage, DispatchEffect),
  cleanFilters: createEffect(cleanFilters, NonDispatchEffect),
  toggleAutoScroll: createEffect(toggleAutoScroll, DispatchEffect),
  setAutoScroll: createEffect(setAutoscroll, NonDispatchEffect),
  toggleLevelFilter: createEffect(toggleLevelFilter, NonDispatchEffect),
  keyPressed: createEffect(keyPressed, DispatchEffect),
};
