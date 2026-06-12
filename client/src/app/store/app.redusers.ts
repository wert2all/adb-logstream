import { createFeature, createReducer, on } from '@ngrx/store';
import { AppState } from './app.types';
import { appActions } from './app.actions';

const initialState: AppState = {
  autoScroll: true,
  filters: {
    query: undefined,
    levels: {
      V: false,
      D: false,
      I: false,
      W: false,
      E: false,
      F: false,
    },
  },
};

export const appFeature = createFeature({
  name: 'appState',
  reducer: createReducer(
    initialState,
    on(
      appActions.setApplicationStateFromStorage,
      (state, { filters, autoScroll }): AppState => ({
        ...state,
        filters: {
          ...state.filters,
          levels: filters ? filters.levels : state.filters.levels,
        },
        autoScroll,
      }),
    ),

    on(
      appActions.cleanFilters,
      (state): AppState => ({
        ...state,
        filters: initialState.filters,
      }),
    ),

    on(
      appActions.setAutoscroll,
      (state, { enabled }): AppState => ({
        ...state,
        autoScroll: enabled,
      }),
    ),
  ),
});
