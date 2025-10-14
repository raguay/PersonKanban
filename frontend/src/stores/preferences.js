import { writable, get } from "svelte/store";

const Pref = {
  showing: false,
  keyboardHandler: null,
  dateformat: "MM/dd/yyyy",
  timeformat: "H:mm:ss",
};

export const preferences = writable(Pref);
