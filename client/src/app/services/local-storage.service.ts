import { Injectable } from '@angular/core';

const LEVELS_KEY = 'logstream-levels';
const AUTO_SCROLL_KEY = 'logstream-auto-scroll-enabled';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  save(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // localStorage unavailable — silently ignore
    }
  }

  load(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  saveFilters(filters: Record<string, boolean>): void {
    this.save(LEVELS_KEY, JSON.stringify(filters));
  }

  loadFilters(): Record<string, boolean> | null {
    const saved = this.load(LEVELS_KEY);
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return parsed as Record<string, boolean>;
      }
    } catch {
      // ignore parse errors
    }
    return null;
  }

  saveAutoScroll(enabled: boolean): void {
    this.save(AUTO_SCROLL_KEY, String(enabled));
  }

  loadAutoScroll(): boolean | null {
    const stored = this.load(AUTO_SCROLL_KEY);
    if (stored === null) return null;
    return stored === 'true';
  }
}
