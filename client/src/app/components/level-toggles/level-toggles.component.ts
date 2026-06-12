import { Component, inject } from '@angular/core';
import { LogStateService } from '../../services/log-state.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-level-toggles',
  standalone: true,
  templateUrl: './level-toggles.component.html',
  styleUrls: ['./level-toggles.component.css'],
})
export class LevelTogglesComponent {
  logState = inject(LogStateService);
  localStorage = inject(LocalStorageService);

  levels = ['V', 'D', 'I', 'W', 'E', 'F'] as const;
  levelNames: Record<string, string> = {
    V: 'Verbose',
    D: 'Debug',
    I: 'Info',
    W: 'Warn',
    E: 'Error',
    F: 'Fatal',
  };

  toggleLevel(level: string): void {
    this.logState.toggleLevel(level);
    this.localStorage.saveFilters(this.logState.levelFilters());
  }

  isActive(level: string): boolean {
    return this.logState.levelFilters()[level] !== false;
  }

  levelColor(level: string): string {
    return `text-log-${level.toLowerCase()}`;
  }
}
