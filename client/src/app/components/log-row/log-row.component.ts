import { Component, computed, inject, input } from '@angular/core';
import { LogstreamEntry } from '../../models/logstream.model';
import { Store } from '@ngrx/store';
import { streamActions } from '../../store/stream/stream.actions';
import { streamFeature } from '../../store/stream/stream.redusers';

@Component({
  selector: 'app-log-row',
  standalone: true,
  templateUrl: './log-row.component.html',
  styleUrls: ['./log-row.component.css'],
})
export class LogRowComponent {
  entry = input.required<LogstreamEntry>();
  query = input<string>('');
  private store = inject(Store);
  private selected = this.store.selectSignal(streamFeature.selectSelected);
  protected isSelected = computed(() => {
    const selected = this.selected();
    const entry = this.entry();
    return selected.some((e) => e.uuid === entry.uuid);
  });

  protected formatMessage = computed((): string => {
    const entry = this.entry();
    if (!this.query()) {
      return this.escapeHtml(entry.message);
    }

    const escapedMessage = this.escapeHtml(entry.message);
    const lowerQuery = this.query().toLowerCase();
    const lowerMessage = entry.message.toLowerCase();

    if (!lowerMessage.includes(lowerQuery)) {
      return escapedMessage;
    }

    const parts: string[] = [];
    let lastIndex = 0;
    let index = lowerMessage.indexOf(lowerQuery);

    while (index !== -1) {
      parts.push(escapedMessage.substring(lastIndex, index));
      parts.push(`<mark>${escapedMessage.substring(index, index + this.query.length)}</mark>`);
      lastIndex = index + this.query.length;
      index = lowerMessage.indexOf(lowerQuery, lastIndex);
    }

    parts.push(escapedMessage.substring(lastIndex));
    return parts.join('');
  });

  protected toggleSelected(): void {
    this.store.dispatch(streamActions.toggleSelection({ uuid: this.entry().uuid }));
  }

  private escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
