import { connect } from "./websocket";
import { initFilters } from "./filter";
import { initSearch } from "./search";
import { initKeyboard } from "./keyboard";
import { clearLog } from "./render";

function init(): void {
  // Initialize UI components
  initFilters();
  initSearch();
  initKeyboard();

  // Clear button handler
  const clearBtn = document.getElementById("clear-btn") as HTMLButtonElement;
  clearBtn.addEventListener("click", clearLog);

  // Connect to WebSocket
  connect();
}

init();
