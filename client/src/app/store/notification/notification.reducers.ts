import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { NotificationState } from './notification.types';
import { notificationActions } from './notification.actions';

const initialState: NotificationState = {
  messages: [],
};

export const notificationFeature = createFeature({
  name: 'notificationState',
  reducer: createReducer(
    initialState,
    on(notificationActions.dismiss, (state, { uuid }) => ({
      ...state,
      messages: state.messages.map((message) =>
        message.uuid === uuid ? { ...message, isOpen: false } : message,
      ),
    })),

    on(
      notificationActions.showMessage,
      (state, { message, messageType }): NotificationState => ({
        ...state,
        messages: [
          ...state.messages,
          {
            message,
            isOpen: true,
            type: messageType,
            uuid: crypto.randomUUID(),
          },
        ],
      }),
    ),
  ),
  extraSelectors: ({ selectMessages }) => {
    const selectOpenMessages = createSelector(selectMessages, (messages) =>
      messages.filter((message) => message.isOpen),
    );

    return {
      selectOpenMessages,
    };
  },
});
