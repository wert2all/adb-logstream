import { state } from "./state";
import { applyVisibility, reRenderAll } from "./render";

const STORAGE_KEY = "logcat-levels";

const toggleContainer = document.getElementById("level-toggles") as HTMLDivElement;

export function initFilters(): void {
  // Load from localStorage
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        Object.assign(state.levelFilters, parsed);
      }
    } catch {
      // ignore parse errors
    }
  }

  // Apply initial state to buttons
  updateToggleButtons();

  // Add click handlers
  const buttons = toggleContainer.querySelectorAll("button[data-level]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const level = btn.getAttribute("data-level");
      if (level) {
        toggleLevel(level);
      }
    });
  });
}

export function toggleLevel(level: string): void {
  state.levelFilters[level] = !state.levelFilters[level];
  saveFilters();
  updateToggleButtons();

  if (state.searchQuery) {
    reRenderAll();
  } else {
    applyVisibility();
  }
}

export function updateToggleButtons(): void {
  const buttons = toggleContainer.querySelectorAll("button[data-level]");
  buttons.forEach((btn) => {
    const level = btn.getAttribute("data-level");
    if (level) {
      const active = state.levelFilters[level];
      if (active) {
        btn.classList.add("bg-surface-container-highest");
      } else {
        btn.classList.remove("bg-surface-container-highest");
      }
    }
  });
}

export function saveFilters(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.levelFilters));
}
