import { Component, Input, inject } from '@angular/core';
import { LogstreamEntry } from '../../models/logstream.model';
import { LogStateService } from '../../services/log-state.service';

@Component({
  selector: 'app-log-row',
  standalone: true,
  templateUrl: './log-row.component.html',
  styleUrls: ['./log-row.component.css'],
})
export class LogRowComponent {
  @Input() entry!: LogstreamEntry;
  @Input() query = '';

  logState = inject(LogStateService);

  isSelected(): boolean {
    return this.logState.isSelected(this.entry.uuid);
  }

  toggleSelected(): void {
    this.logState.toggleSelection(this.entry.uuid);
  }

  formatMessage(): string {
    if (!this.query) {
      return this.escapeHtml(this.entry.message);
    }

    const escapedMessage = this.escapeHtml(this.entry.message);
    const lowerQuery = this.query.toLowerCase();
    const lowerMessage = this.entry.message.toLowerCase();

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
  }

  private escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
