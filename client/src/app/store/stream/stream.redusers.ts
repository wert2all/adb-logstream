import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { StreamState } from './stream.types';
import { streamActions } from './stream.actions';

const initialState: StreamState = {
  autoScroll: true,
  selected: [],
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

export const streamFeature = createFeature({
  name: 'streamState',
  reducer: createReducer(
    initialState,
    on(
      streamActions.setApplicationStateFromStorage,
      (state, { filters, autoScroll }): StreamState => ({
        ...state,
        filters: {
          ...state.filters,
          levels: filters ? filters : state.filters.levels,
        },
        autoScroll,
      }),
    ),

    on(
      streamActions.cleanFilters,
      (state): StreamState => ({
        ...state,
        filters: initialState.filters,
      }),
    ),

    on(
      streamActions.setAutoscroll,
      (state, { enabled }): StreamState => ({
        ...state,
        autoScroll: enabled,
      }),
    ),

    on(
      streamActions.setQuery,
      (state, { query }): StreamState => ({
        ...state,
        filters: { ...state.filters, query },
      }),
    ),

    on(
      streamActions.cleanQuery,
      (state): StreamState => ({
        ...state,
        filters: { ...state.filters, query: undefined },
      }),
    ),

    on(
      streamActions.toggleLevel,
      (state, { level }): StreamState => ({
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
