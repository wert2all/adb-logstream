import { Component, inject, AfterViewInit, ElementRef, ViewChild, effect } from '@angular/core';
import { LogStateService } from '../../services/log-state.service';
import { LogRowComponent } from '../log-row/log-row.component';

@Component({
  selector: 'app-log-list',
  standalone: true,
  imports: [LogRowComponent],
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.css'],
})
export class LogListComponent implements AfterViewInit {
  logState = inject(LogStateService);

  @ViewChild('container', { static: true })
  container!: ElementRef<HTMLDivElement>;

  constructor() {
    effect(() => {
      this.logState.getFilteredEntries();
      if (this.logState.autoScrollEnabled()) {
        requestAnimationFrame(() => this.scrollToBottom());
      }
    });
  }

  ngAfterViewInit(): void {}

  scrollToBottom(): void {
    const el = this.container.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
}
