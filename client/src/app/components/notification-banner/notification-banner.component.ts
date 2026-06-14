import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { notificationFeature } from '../../store/notification/notification.reducers';
import { notificationActions } from '../../store/notification/notification.actions';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorXSquareDuotone } from '@ng-icons/phosphor-icons/duotone';

@Component({
  selector: 'app-notification-banner',
  standalone: true,
  imports: [NgIcon],
  providers: [provideIcons({ phosphorXSquareDuotone })],
  templateUrl: './notification-banner.component.html',
  styleUrls: ['./notification-banner.component.css'],
})
export class NotficationBannerComponent {
  private store = inject(Store);

  protected messages = this.store.selectSignal(notificationFeature.selectOpenMessages);

  dismiss(uuid: string): void {
    this.store.dispatch(notificationActions.dismiss({ uuid }));
  }
}
