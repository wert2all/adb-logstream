import { Component, computed, inject } from '@angular/core';
import { LogStateService } from '../../services/log-state.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Level, LevelNames } from '../../app.types';
import { Store } from '@ngrx/store';
import { appFeature } from '../../store/app.redusers';
import { appActions } from '../../store/app.actions';

@Component({
  selector: 'app-level-toggles',
  standalone: true,
  templateUrl: './level-toggles.component.html',
  styleUrls: ['./level-toggles.component.css'],
})
export class LevelTogglesComponent {
  private store = inject(Store);
  private levelFilters = this.store.selectSignal(appFeature.selectLevelFilters);

  protected logState = inject(LogStateService);
  protected localStorage = inject(LocalStorageService);

  protected levels = computed(() => {
    const filters = this.levelFilters();
    return Object.keys(LevelNames).map((key) => ({
      key,
      isActive: filters[key as Level] !== false,
    }));
  });

  toggleLevel(level: string): void {
    this.logState.toggleLevel(level);

    this.store.dispatch(appActions.toggleLevel({ level: level as Level }));
  }
}
