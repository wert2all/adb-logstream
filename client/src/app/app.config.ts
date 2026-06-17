import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideState, provideStore } from '@ngrx/store';
import { streamFeature } from './store/stream/stream.reducers';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { streamEffects } from './store/stream/stream.effects';
import { notificationFeature } from './store/notification/notification.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideStore(),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true, // If set to true, the connection is established within the Angular zone
    }),
    provideState(streamFeature),
    provideState(notificationFeature),
    provideEffects(streamEffects),
  ],
};
