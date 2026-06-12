import { Component, inject } from '@angular/core';
import { LogStateService } from '../../services/log-state.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  logState = inject(LogStateService);
  localStorage = inject(LocalStorageService);

  onToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.logState.setAutoScroll(checked);
    this.localStorage.saveAutoScroll(checked);
  }
}
