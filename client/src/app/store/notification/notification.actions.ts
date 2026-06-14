import { createActionGroup, props } from '@ngrx/store';

export const notificationActions = createActionGroup({
  source: 'notifications',
  events: {
    dismiss: props<{ uuid: string }>(),
    'show message': props<{
      message: string;
      messageType: 'success' | 'error';
    }>(),
  },
});
