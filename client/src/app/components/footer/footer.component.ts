import { Component, computed, inject } from '@angular/core';
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
  protected autoScrollEnabled = this.store.selectSignal(streamFeature.selectAutoScroll);

  protected autoScrollClass = computed(() =>
    this.autoScrollEnabled() ? 'bg-secondary' : 'bg-outline-variant',
  );
  protected autoScrollLabel = computed(() =>
    this.autoScrollEnabled() ? 'Autoscroll is enabled' : 'Autoscroll is disabled',
  );
  private selected = this.store.selectSignal(streamFeature.selectSelected);
  protected hasSelection = computed(() => {
    const selected = this.selected();
    return selected.length > 0;
  });

  protected copyLogs(): void {
    this.store.dispatch(streamActions.copySelected());
  }

  protected onToggle(): void {
    this.store.dispatch(streamActions.toggleAutoscroll());
  }
}
