import { writable } from "svelte/store";
import * as App from "../../wailsjs/go/main/App.js";

export const metaboard = writable({
  showing: false,
  metaboards: [],
  cursor: 0,
  getCursor: function() {
    return this.cursor;
  },
  incCursor: function() {
    this.cursor = this.cursor + 1;
    if(this.cursor >= this.metaboards.length) this.cursor = this.metaboards.length - 1;
  },
  decCursor: function() {
    this.cursor = this. cursor - 1;
    if(this.cursor < 0) this.cursor = 0;
  },
  setShowing: function () {
    this.showing = true;
  },
  clearShowing: function () {
    this.showing = false;
  },
  toggleShowing: function () {
    this.showing = !this.showing;
  },
  addmetaboard: function (name, desc, destype, loc) {
    //
    // If the metaboard parameters are valid, save the new metaboard.
    //
    if (name !== "") {
      this.metaboards.push({
        name: name,
        description: desc,
        type: destype,
        loc: loc,
      });
    }
  },
  getmetaboard: function (name) {
    //
    // This function returns the metaboard that matches the name.
    //
    const boardlist = this.metaboards.filter((item) => item.name === name);
    let result = null;
    if (boardlist.length > 0) {
      //
      // Found the metaboard. Return it.
      //
      result = boardlist[0];
    }
    return result;
  },
  removemetaboard: function (name) {
    //
    // This will remove the metaboard given.
    //
    this.metaboards = this.metaboards.filter((item) => item.name !== name);
  },
  loadMetaBoards: async function () {
    const hdir = await App.GetHomeDir();
    const configdir = await App.AppendPath(hdir, ".config");
    const kbcnfgdir = await App.AppendPath(configdir, "PersonKanban");
    const kanbanfile = await App.AppendPath(kbcnfgdir, "kanban.json");
    const metafile = await App.AppendPath(kbcnfgdir, "metaboards.json");
    if (!(await App.DirExists(kbcnfgdir))) {
      //
      // The directory exist, so read the config file.
      //
      await App.MakeDir(kbcnfgdir);
    }
    if (await App.FileExists(metafile)) {
      //
      // The file exits. Therefore, read it in.
      //
      this.metaboards = JSON.parse(await App.ReadFile(metafile));
    } else {
      //
      // The file doesn't exist. Create the metaboards.json file.
      //
      this.metaboards = [
        {
          name: "Default",
          description: "",
          desctype: "text",
          loc: kanbanfile,
        },
      ];
    }
    await this.saveMetaBoards();
  },
  saveMetaBoards: async function () {
    const hdir = await App.GetHomeDir();
    const configdir = await App.AppendPath(hdir, ".config");
    const kbcnfgdir = await App.AppendPath(configdir, "PersonKanban");
    const metafile = await App.AppendPath(kbcnfgdir, "metaboards.json");
    await App.WriteFile(metafile, JSON.stringify(this.metaboards));
  },
});
