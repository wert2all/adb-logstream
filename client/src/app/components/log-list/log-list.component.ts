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

  private userAtBottom = true;

  constructor() {
    effect(() => {
      // React to filtered entries changes
      this.logState.getFilteredEntries();
      if (this.logState.autoScrollEnabled() && this.userAtBottom) {
        requestAnimationFrame(() => this.scrollToBottom());
      }
    });
  }

  ngAfterViewInit(): void {
    const el = this.container.nativeElement;
    el.addEventListener('scroll', () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
      if (!atBottom && this.logState.autoScrollEnabled()) {
        this.logState.setAutoScroll(false);
      }
      this.userAtBottom = atBottom;
    });
  }

  scrollToBottom(): void {
    const el = this.container.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
}
