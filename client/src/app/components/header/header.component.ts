import { Component, computed, inject } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { LevelTogglesComponent } from '../level-toggles/level-toggles.component';
import { PackageFilterComponent } from '../package-filter/package-filter.component';
import { Store } from '@ngrx/store';
import { streamActions } from '../../store/stream/stream.actions';
import { streamFeature } from '../../store/stream/stream.reducers';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBarComponent, LevelTogglesComponent, PackageFilterComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private store = inject(Store);
  private selected = this.store.selectSignal(streamFeature.selectSelected);
  private connectionStatus = this.store.selectSignal(streamFeature.selectConnectionStatus);
  protected hasSelected = computed(() => this.selected().length > 0);
  protected totalReceived = this.store.selectSignal(streamFeature.selectTotalReceived);
  protected statusClass = computed(() => {
    const status = this.connectionStatus();
    switch (status) {
      case 'connected':
        return { dot: 'bg-secondary', text: 'text-secondary' };
      case 'disconnected':
        return { dot: 'bg-error', text: 'text-error' };
      case 'reconnecting':
        return { dot: 'bg-log-w', text: 'text-log-w' };
    }
  });
  protected statusLabel = computed(() => {
    const status = this.connectionStatus();
    switch (status) {
      case 'connected':
        return 'CONNECTED';
      case 'disconnected':
        return 'DISCONNECTED';
      case 'reconnecting':
        return 'RECONNECTING';
    }
  });

  clearFilters(): void {
    this.store.dispatch(streamActions.cleanFilters());
  }

  copyLogs(): void {
    this.store.dispatch(streamActions.copySelected());
  }
}
