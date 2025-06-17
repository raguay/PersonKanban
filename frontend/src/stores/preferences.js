import { writable, get } from "svelte/store";

const Pref = {
  showing: false,
  keyboardHandler: null,
};

export const preferences = writable(Pref);
