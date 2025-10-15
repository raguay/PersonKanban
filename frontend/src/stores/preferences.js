import { writable } from "svelte/store";
import * as App from "../../wailsjs/go/main/App.js";


const Pref = {
  showing: false,
  keyboardHandler: null,
  system: false,
  preflocation: null,
  prefs: {
    dateformat: "MM/dd/yyyy",
    timeformat: "H:mm:ss",
  },
  SetPrefLocation: async function () {
    const hdir = await App.GetHomeDir();
    const configdir = await App.AppendPath(hdir, ".config");
    const kbcnfgdir = await App.AppendPath(configdir, "PersonKanban");
    this.preflocation = await App.AppendPath(kbcnfgdir, "system.json");
  },
  SavePrefs: async function () {
    if (this.preflocation === null) await this.SetPrefLocation();
    await App.WriteFile(
      this.preflocation,
      JSON.stringify(this.prefs),
    );
  },
  LoadPrefs: async function () {
    if (this.preflocation === null) await this.SetPrefLocation();
    if (await App.FileExists(this.preflocation)) {
      //
      // The directory exist, so read the config file.
      //
      let rawpref = await App.ReadFile(
        this.preflocation
      );
      this.prefs = JSON.parse(rawpref);
    } else {
      //
      // Save the default preferences.
      //
      await this.SavePrefs();
    }
  },

};

export const preferences = writable(Pref);
