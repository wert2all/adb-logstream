import { Component, Input, signal } from '@angular/core';
import { LogstreamEntry } from '../../models/logstream.model';

@Component({
  selector: 'app-log-row',
  standalone: true,
  templateUrl: './log-row.component.html',
  styleUrls: ['./log-row.component.css'],
})
export class LogRowComponent {
  @Input() entry!: LogstreamEntry;
  @Input() query = '';

  selected = signal(false);

  toggleSelected(): void {
    this.selected.update((v) => !v);
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
