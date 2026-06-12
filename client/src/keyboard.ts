import { clearLog } from './render';
import { toggleLevel } from './filter';
import { clearSearch, focusSearch, searchInput } from './search';

export function initKeyboard(): void {
  document.addEventListener('keydown', (event) => {
    // Don't trigger shortcuts when typing in an input or textarea
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      if (event.key === 'Escape') {
        clearSearch();
        event.preventDefault();
      }
      return;
    }

    switch (event.key) {
      case '/':
        event.preventDefault();
        focusSearch();
        break;
      case 'Escape':
        clearSearch();
        event.preventDefault();
        break;
      case 'c':
      case 'C':
        clearLog();
        event.preventDefault();
        break;
      case 'v':
      case 'V':
        toggleLevel('V');
        event.preventDefault();
        break;
      case 'd':
      case 'D':
        toggleLevel('D');
        event.preventDefault();
        break;
      case 'i':
      case 'I':
        toggleLevel('I');
        event.preventDefault();
        break;
      case 'w':
      case 'W':
        toggleLevel('W');
        event.preventDefault();
        break;
      case 'e':
      case 'E':
        toggleLevel('E');
        event.preventDefault();
        break;
      case 'f':
      case 'F':
        toggleLevel('F');
        event.preventDefault();
        break;
    }
  });
}
