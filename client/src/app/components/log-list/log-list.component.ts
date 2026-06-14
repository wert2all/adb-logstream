import { Component, inject, AfterViewInit, ElementRef, ViewChild, effect } from '@angular/core';
import { LogRowComponent } from '../log-row/log-row.component';
import { Store } from '@ngrx/store';
import { appFeature } from '../../store/app.redusers';
import { LogStateService } from '../../services/log-state.service';

@Component({
  selector: 'app-log-list',
  standalone: true,
  imports: [LogRowComponent],
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.css'],
})
export class LogListComponent {
  private store = inject(Store);
  private autoScrollEnabled = this.store.selectSignal(appFeature.selectAutoScroll);

  @ViewChild('container', { static: true })
  protected container!: ElementRef<HTMLDivElement>;
  protected logState = inject(LogStateService);

  constructor() {
    effect(() => {
      if (this.autoScrollEnabled()) {
        requestAnimationFrame(() => this.scrollToBottom());
      }
    });
  }

  scrollToBottom(): void {
    const el = this.container.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
}
