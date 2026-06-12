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
