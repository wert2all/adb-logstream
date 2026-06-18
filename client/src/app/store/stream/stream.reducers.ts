import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { StreamState } from './stream.types';
import { streamActions } from './stream.actions';

const initialState: StreamState = {
  autoScroll: true,
  selected: [],
  totalReceived: 0,
  connectionStatus: 'disconnected',
  entries: [],
  packageFilter: null,
  filters: {
    query: undefined,
    levels: {
      V: false,
      D: false,
      I: false,
      W: false,
      E: true,
      F: true,
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
        selected: [],
        packageFilter: null,
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

    on(streamActions.appendEntry, (state, { entry }): StreamState => {
      const query = state.filters.query;
      const levels = state.filters.levels;
      const packageFilter = state.packageFilter;
      const levelVisible = levels[entry.level] !== false;

      if (!levelVisible || (query && !entry.message.toLowerCase().includes(query.toLowerCase()))) {
        return state;
      }

      if (
        packageFilter &&
        !entry.packageName?.toLowerCase().includes(packageFilter.toLowerCase())
      ) {
        return state;
      }

      const entries = [...state.entries, entry];

      if (entries.length > 5000) {
        entries.shift();
      }
      return {
        ...state,
        entries,
        totalReceived: state.totalReceived + 1,
      };
    }),

    on(streamActions.copied, (state): StreamState => {
      return {
        ...state,
        selected: [],
      };
    }),
    on(
      streamActions.setConnectionStatus,
      (state, { status }): StreamState => ({
        ...state,
        connectionStatus: status,
      }),
    ),

    on(streamActions.toggleSelection, (state, { uuid }): StreamState => {
      const entry = state.entries.find((e) => e.uuid === uuid);
      if (!entry) return state;

      const isSelected = state.selected.some((e) => e.uuid === uuid);
      const selected = isSelected
        ? state.selected.filter((e) => e.uuid !== uuid)
        : [...state.selected, entry];

      return { ...state, selected };
    }),

    on(
      streamActions.setPackageFilter,
      (state, { query }): StreamState => ({
        ...state,
        packageFilter: query || null,
      }),
    ),

    on(
      streamActions.cleanPackageFilter,
      (state): StreamState => ({
        ...state,
        packageFilter: null,
      }),
    ),
  ),
  extraSelectors: ({ selectFilters, selectSelected, selectEntries }) => {
    const selectQuery = createSelector(selectFilters, (filters) => filters.query);

    const selectQueryString = createSelector(selectFilters, (filters) => filters.query || '');
    const selectLevelFilters = createSelector(selectFilters, (filters) => filters.levels);

    const hasSelected = createSelector(
      selectSelected,
      (selectSelected) => selectSelected.length > 0,
    );

    const selectPackageNames = createSelector(selectEntries, (entries) => {
      const names = new Set<string>();
      for (const entry of entries) {
        if (entry.packageName) names.add(entry.packageName);
      }
      return Array.from(names).sort();
    });

    return {
      selectQuery,
      selectQueryString,
      selectLevelFilters,
      hasSelected,
      selectPackageNames,
    };
  },
});
