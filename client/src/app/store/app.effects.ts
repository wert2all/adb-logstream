import { inject } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { map, tap } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { appActions } from './app.actions';
import { DispatchEffect, NonDispatchEffect } from './../app.types';
import { Store } from '@ngrx/store';
import { appFeature } from './app.redusers';
import { concatLatestFrom } from '@ngrx/operators';

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
    map(({ autoScroll }) =>
      appActions.setApplicationStateFromStorage({
        filters: null,
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

export const appEffects = {
  initStateFromStorage: createEffect(initStateFromStorage, DispatchEffect),
  cleanFilters: createEffect(cleanFilters, NonDispatchEffect),
  toggleAutoScroll: createEffect(toggleAutoScroll, DispatchEffect),
  setAutoScroll: createEffect(setAutoscroll, NonDispatchEffect),
};
