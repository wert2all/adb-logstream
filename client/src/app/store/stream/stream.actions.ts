import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ConnectionStatus, LevelFilter } from "./stream.types";
import { KeyboardShortcut, Level, Undefined } from "../../app.types";

export const streamActions = createActionGroup({
  source: "stream",
  events: {
    "set application state from storage": props<{
      filters: LevelFilter | Undefined;
      autoScroll: boolean;
    }>(),
    "clean filters": emptyProps(),
    "toggle autoscroll": emptyProps(),
    "set autoscroll": props<{ enabled: boolean }>(),

    "set query": props<{ query: string }>(),
    "clean query": emptyProps(),

    "toggle level": props<{ level: Level }>(),

    "key pressed": props<{ key: KeyboardShortcut }>(),
    "no shortcut key pressed": emptyProps(),

    "copy selected entries": emptyProps(),

    "copy selected": emptyProps(),
    "empty selection": emptyProps(),
    copied: emptyProps(),
    "copy failed": emptyProps(),
    "set connection status": props<{ status: ConnectionStatus }>(),
  },
});
