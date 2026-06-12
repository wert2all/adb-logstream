import { connect } from "./websocket";
import { initFilters } from "./filter";
import { initSearch } from "./search";
import { initKeyboard } from "./keyboard";
import { clearLog, updateAutoScrollIndicator } from "./render";
import { loadAutoScrollState, saveAutoScrollState, state } from "./state";

function init(): void {
  // Initialize UI components
  initFilters();
  initSearch();
  initKeyboard();

  // Clear button handler
  const clearBtn = document.getElementById("clear-btn") as HTMLButtonElement;
  clearBtn.addEventListener("click", clearLog);

  // Auto-scroll toggle
  loadAutoScrollState();
  const autoScrollToggle = document.getElementById("auto-scroll-toggle") as HTMLInputElement;
  autoScrollToggle.checked = state.autoScrollEnabled;
  updateAutoScrollIndicator();

  autoScrollToggle.addEventListener("change", () => {
    state.autoScrollEnabled = autoScrollToggle.checked;
    saveAutoScrollState();
    updateAutoScrollIndicator();
  });

  // Connect to WebSocket
  connect();
}

init();
