import { writable, get } from "svelte/store";
import { metaboard } from "./metaboard.js";
import { boardCursor } from "./boardCursor.js";
import { listCursor } from "./listCursor.js";
import { itemCursor } from "./itemCursor.js";
import * as App from "../../wailsjs/go/main/App.js";

const Pref = {
  showing: false,
  keyboardHandler: null,
};

export const preferences = writable(Pref);
