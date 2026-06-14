import { Component, HostListener, inject, OnInit } from "@angular/core";
import { LogStateService } from "../../services/log-state.service";
import { WebSocketService } from "../../services/websocket.service";
import { HeaderComponent } from "../header/header.component";
import { ConnectionBannerComponent } from "../connection-banner/connection-banner.component";
import { LogListComponent } from "../log-list/log-list.component";
import { FooterComponent } from "../footer/footer.component";
import { Store } from "@ngrx/store";
import { KeyboardShortcut, KeyboardShortcuts } from "../../app.types";
import { streamActions } from "../../store/stream/stream.actions";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    HeaderComponent,
    ConnectionBannerComponent,
    LogListComponent,
    FooterComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  private store = inject(Store);
  private logState: LogStateService = inject(LogStateService);
  private webSocket: WebSocketService = inject(WebSocketService);

  ngOnInit(): void {
    // Connect WebSocket
    this.webSocket.connect();
  }

  private isShortcut(key: string): key is KeyboardShortcut {
    return KeyboardShortcuts.includes(key as KeyboardShortcut);
  }

  @HostListener("document:keydown", ["$event"])
  onKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLocaleLowerCase();
    if (this.isShortcut(key)) {
      this.store.dispatch(streamActions.keyPressed({ key }));
      event.preventDefault();
      if (key === "/") {
        document.getElementById("search-input")?.focus();
      }
    }
    switch (event.key) {
      case "/":
        event.preventDefault();
        document.getElementById("search-input")?.focus();
        break;
      case "Escape":
        this.logState.setSearchQuery("");
        event.preventDefault();
        break;
      case "c":
      case "C":
        this.logState.clearLog();
        event.preventDefault();
        break;
      case "v":
      case "V":
        this.logState.toggleLevel("V");
        event.preventDefault();
        break;
      case "d":
      case "D":
        this.logState.toggleLevel("D");
        event.preventDefault();
        break;
      case "i":
      case "I":
        this.logState.toggleLevel("I");
        event.preventDefault();
        break;
      case "w":
      case "W":
        this.logState.toggleLevel("W");
        event.preventDefault();
        break;
      case "e":
      case "E":
        this.logState.toggleLevel("E");
        event.preventDefault();
        break;
      case "f":
      case "F":
        this.logState.toggleLevel("F");
        event.preventDefault();
        break;
    }
  }
}
