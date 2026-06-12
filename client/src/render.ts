import { state, LogstreamEntry } from "./state";

const LOG_LEVEL_COLORS: Record<string, string> = {
  V: "text-log-v",
  D: "text-log-d",
  I: "text-log-i",
  W: "text-log-w",
  E: "text-log-e",
  F: "text-log-f",
};

const MAX_DOM_ENTRIES = 5000;

const logList = document.getElementById("log-list") as HTMLDivElement;
const logContainer = document.getElementById("log-container") as HTMLDivElement;
const entryCount = document.getElementById("entry-count") as HTMLSpanElement;
const autoScrollIndicator = document.getElementById("auto-scroll-indicator") as HTMLSpanElement;

let userScrolledUp = false;

logContainer.addEventListener("scroll", () => {
  const atBottom = logContainer.scrollTop + logContainer.clientHeight >= logContainer.scrollHeight - 50;
  userScrolledUp = !atBottom;
});

export function createEntryRow(entry: LogstreamEntry): HTMLElement {
  const row = document.createElement("div");
  row.className = "log-row px-2 py-0.5 rounded transition-colors";
  row.setAttribute("data-level", entry.level);

  const colorClass = LOG_LEVEL_COLORS[entry.level] || "text-on-surface";

  row.innerHTML = `
    <span class="text-outline-variant shrink-0 text-xs w-[100px] tabular-nums">${escapeHtml(entry.timestamp)}</span>
    <span class="${colorClass} w-6 shrink-0 font-bold text-center text-xs">${escapeHtml(entry.level)}</span>
    <span class="text-outline w-40 shrink-0 truncate pr-2 text-xs">${escapeHtml(entry.tag)}</span>
    <span class="${colorClass} flex-1 break-all">${formatMessage(entry.message, state.searchQuery)}</span>
  `;

  return row;
}

export function appendEntry(entry: LogstreamEntry): void {
  state.entries.push(entry);
  state.totalReceived++;

  const row = createEntryRow(entry);
  logList.appendChild(row);

  // Cap DOM entries
  if (state.entries.length > MAX_DOM_ENTRIES) {
    const removed = state.entries.shift();
    if (removed && logList.firstChild) {
      logList.removeChild(logList.firstChild);
    }
  }

  updateCount();
  applyVisibility();
  autoScroll();
}

export function applyVisibility(): void {
  const query = state.searchQuery.toLowerCase();
  const rows = logList.children;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] as HTMLElement;
    const level = row.getAttribute("data-level");
    const levelVisible = level ? state.levelFilters[level] !== false : true;

    let searchVisible = true;
    if (query) {
      const text = row.textContent?.toLowerCase() || "";
      searchVisible = text.includes(query);
    }

    row.style.display = levelVisible && searchVisible ? "" : "none";
  }
}

export function clearLog(): void {
  state.entries = [];
  state.totalReceived = 0;
  logList.innerHTML = "";
  updateCount();
}

export function updateCount(): void {
  entryCount.textContent = `${state.totalReceived} entries`;
}

export function autoScroll(): void {
  if (state.autoScrollEnabled && !userScrolledUp) {
    logContainer.scrollTop = logContainer.scrollHeight;
  }
}

export function updateAutoScrollIndicator(): void {
  autoScrollIndicator.textContent = state.autoScrollEnabled ? "Auto-scroll: ON" : "Auto-scroll: OFF";
}

export function escapeHtml(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

export function formatMessage(message: string, query: string): string {
  if (!query) {
    return escapeHtml(message);
  }

  const escapedMessage = escapeHtml(message);
  const lowerQuery = query.toLowerCase();
  const lowerMessage = message.toLowerCase();

  if (!lowerMessage.includes(lowerQuery)) {
    return escapedMessage;
  }

  // Highlight matches
  const parts: string[] = [];
  let lastIndex = 0;
  let index = lowerMessage.indexOf(lowerQuery);

  while (index !== -1) {
    parts.push(escapedMessage.substring(lastIndex, index));
    parts.push(`<mark>${escapedMessage.substring(index, index + query.length)}</mark>`);
    lastIndex = index + query.length;
    index = lowerMessage.indexOf(lowerQuery, lastIndex);
  }

  parts.push(escapedMessage.substring(lastIndex));
  return parts.join("");
}

export function reRenderAll(): void {
  logList.innerHTML = "";
  const query = state.searchQuery.toLowerCase();

  for (const entry of state.entries) {
    const levelVisible = state.levelFilters[entry.level] !== false;
    const searchVisible = !query || (entry.tag + " " + entry.message).toLowerCase().includes(query);

    if (levelVisible && searchVisible) {
      logList.appendChild(createEntryRow(entry));
    }
  }

  autoScroll();
}

export { logContainer, logList };
