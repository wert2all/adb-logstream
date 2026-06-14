import { EffectConfig } from '@ngrx/effects';

export type Undefined = undefined | null;

export const DispatchEffect: EffectConfig & {
  functional: true;
  dispatch?: true;
} = { functional: true };
export const NonDispatchEffect: EffectConfig & {
  functional: true;
  dispatch: false;
} = {
  functional: true,
  dispatch: false,
};

export type Level = 'V' | 'D' | 'I' | 'W' | 'E' | 'F';
export const LevelNames: Record<Level, string> = {
  V: 'Verbose',
  D: 'Debug',
  I: 'Info',
  W: 'Warn',
  E: 'Error',
  F: 'Fatal',
};

export const KeyboardShortcuts = ['/', 'Escape', 'c', 'a', 'v', 'd', 'i', 'w', 'e', 'f'] as const;

export type KeyboardShortcut = (typeof KeyboardShortcuts)[number];
