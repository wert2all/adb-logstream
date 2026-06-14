import { Injectable } from '@angular/core';
import { LevelFilter } from '../store/stream/stream.types';

const LEVELS_KEY = 'logstream-levels';
const AUTO_SCROLL_KEY = 'logstream-auto-scroll-enabled';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private save(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // localStorage unavailable — silently ignore
    }
  }

  private load(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  loadFilters(): LevelFilter | null {
    const saved = this.load(LEVELS_KEY);
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return parsed as LevelFilter;
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

  saveFilters(filters: LevelFilter): void {
    this.save(LEVELS_KEY, JSON.stringify(filters));
  }

  cleanFilters() {
    localStorage.removeItem(LEVELS_KEY);
  }
}
