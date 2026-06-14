import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
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
          levels: filters ? filters : state.filters.levels,
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

    on(
      appActions.setQuery,
      (state, { query }): AppState => ({
        ...state,
        filters: { ...state.filters, query },
      }),
    ),

    on(
      appActions.cleanQuery,
      (state): AppState => ({
        ...state,
        filters: { ...state.filters, query: undefined },
      }),
    ),

    on(
      appActions.toggleLevel,
      (state, { level }): AppState => ({
        ...state,
        filters: {
          ...state.filters,
          levels: {
            ...state.filters.levels,
            [level]: !state.filters.levels[level],
          },
        },
      }),
    ),
  ),
  extraSelectors: ({ selectFilters }) => {
    const selectQuery = createSelector(selectFilters, (filters) => filters.query);

    const selectQueryString = createSelector(selectFilters, (filters) => filters.query || '');
    const selectLevelFilters = createSelector(selectFilters, (filters) => filters.levels);

    return {
      selectQuery,
      selectQueryString,
      selectLevelFilters,
    };
  },
});
