import { Component, computed, inject } from '@angular/core';
import { Level, LevelNames } from '../../app.types';
import { Store } from '@ngrx/store';
import { streamFeature } from '../../store/stream/stream.reducers';
import { streamActions } from '../../store/stream/stream.actions';

@Component({
  selector: 'app-level-toggles',
  standalone: true,
  templateUrl: './level-toggles.component.html',
  styleUrls: ['./level-toggles.component.css'],
})
export class LevelTogglesComponent {
  private store = inject(Store);
  private levelFilters = this.store.selectSignal(streamFeature.selectLevelFilters);

  protected levels = computed(() => {
    const filters = this.levelFilters();
    return Object.keys(LevelNames).map((key) => ({
      key,
      isActive: filters[key as Level] !== false,
    }));
  });

  toggleLevel(level: string): void {
    this.store.dispatch(streamActions.toggleLevel({ level: level as Level }));
  }
}
