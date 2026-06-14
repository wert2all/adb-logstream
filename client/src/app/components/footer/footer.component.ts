import { Component, computed, inject } from '@angular/core';
import { LogStateService } from '../../services/log-state.service';
import { Store } from '@ngrx/store';
import { streamActions } from '../../store/stream/stream.actions';
import { streamFeature } from '../../store/stream/stream.redusers';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private store = inject(Store);
  logState = inject(LogStateService);
  autoScrollEnabled = this.store.selectSignal(streamFeature.selectAutoScroll);

  autoScrollClass = computed(() =>
    this.autoScrollEnabled() ? 'bg-secondary' : 'bg-outline-variant',
  );
  autoScrollLabel = computed(() =>
    this.autoScrollEnabled() ? 'Autoscroll is enabled' : 'Autoscroll is disabled',
  );

  copyLogs(): void {
    this.logState.copySelected();
  }

  onToggle(): void {
    this.store.dispatch(streamActions.toggleAutoscroll());
  }
}
