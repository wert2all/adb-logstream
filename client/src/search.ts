import { state } from "./state";
import { reRenderAll, applyVisibility } from "./render";

const searchInput = document.getElementById("search-input") as HTMLInputElement;
const searchClearBtn = document.getElementById(
  "search-clear",
) as HTMLButtonElement;

export function initSearch(): void {
  searchInput.addEventListener("input", () => {
    state.searchQuery = searchInput.value;
    updateClearButton();
    reRenderAll();
  });

  searchClearBtn.addEventListener("click", () => {
    clearSearch();
  });

  // Escape key handled by keyboard.ts
}

export function clearSearch(): void {
  searchInput.value = "";
  state.searchQuery = "";
  updateClearButton();
  searchInput.blur();
  reRenderAll();
}

export function focusSearch(): void {
  searchInput.focus();
}

export function updateClearButton(): void {
  if (state.searchQuery) {
    searchClearBtn.classList.remove("hidden");
  } else {
    searchClearBtn.classList.add("hidden");
  }
}

export { searchInput };
