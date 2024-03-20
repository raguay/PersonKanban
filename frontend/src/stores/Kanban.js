import { writable, get } from 'svelte/store';
import { metaboard } from './metaboard.js';
import { boardCursor } from "./boardCursor.js";
import { listCursor } from "./listCursor.js";
import { itemCursor } from "./itemCursor.js";
import * as App from "../../wailsjs/go/main/App.js";

const DefaultKanban = {
  boards: [],
  defaultStyles: {
    backgroundcolor: "blue",
    textcolor: "white",
    unselectTabColor: "lightgray",
    unselectTabTextColor: "black",
    selectTabColor: "lightblue",
    selectTabTextColor: "black",
    mainboardcolor: "lightblue",
    listcontainercolor: "lightblue",
    font: '"Fira Code"',
    fontsize: 16,
    dialogBGColor: "lightblue",
    dialogTextColor: "black",
    cursorColor: "blue",
    cursorText: "white",
    cursorWidth: "10px",
    kanbanInfo: "black",
  },
  defaultListStyle: {
    listbgcolor: "#9AC2FA",
    cursorColor: "blue",
    cursorText: "white",
    cursorWidth: "10px",
    dialogBGColor: "lightblue",
    dialogTextColor: "black",
    listtextcolor: "white",
  },
  defaultItemStyle: {
    itembgcolor: "white",
    cursorColor: "blue",
    cursorText: "white",
    cursorWidth: "10px",
    dialogBGColor: "lightblue",
    dialogTextColor: "black",
    itemtextcolor: "black",
  },
  SaveKanbanBoards: async function() {
    const mtboard = get(metaboard);
    await App.WriteFile(
    mtboard.metaboards[mtboard.cursor].loc,
    JSON.stringify(this.boards),
  )},
  LoadCurrentKanbanBoards: async function() {
    const mtboard = get(metaboard);
    if (await App.FileExists(mtboard.metaboards[mtboard.cursor].loc)) {
      //
      // The directory exist, so read the config file.
      //
      this.boards = JSON.parse(
        await App.ReadFile(mtboard.metaboards[mtboard.cursor].loc),
      );
    } else {
       //
       // Clear the boards.
       //
       this.boards = [];
    }
    if (this.boards.length === 0) {
       //
       // Create the default board if there are no boards.
       //
       this.addBoard();
    }

    //
    // Make sure all the boards have their own style and information. This is to update
    //  the data structures from an old build.
    //
    /*
    this.boards = this.boards.forEach((_, key, arr) => {
      arr[key].styles = this.defaultStyles;
      arr[key].description = "";
      arr[key].desctype = "text";
      arr[key].lists.forEach((lst, key2, arr2) => {
        arr2[key2].styles = this.defaultListStyle;
        lst.items.forEach((_, key3, arr3) => {
          arr3[key3].styles = this.defaultItemStyle;
        });
      });
    });
    */
    this.SaveKanbanBoards();
  },
  addBoard: async function() {
    //
    // Using the default styles as a template. Maybe change that in the future?
    //
    this.boards.push({
      name: "New Board",
      description: "",
      desctype: "text",
      styles: this.defaultStyles,
      lists: []
    });
    await this.SaveKanbanBoards();
  },
  addList: async function() {
    const bcur = get(boardCursor);
    this.boards[bcur].lists.push({
      name: "New List",
      styles: this.defaultListStyle,
      items: [],
    });
    await this.SaveKanbanBoards();
  },
  addItem: async function() {
    const bcur = get(boardCursor);
    const lcur = get(listCursor);
    this.boards[bcur].lists[lcur].items.push({
      name: "New Item",
      description: "This should describe the card's function.",
      notes: [],
      styles: this.defaultItemStyle,
      apps: [],
    });
    await this.SaveKanbanBoards();
  },
  deleteBoard: async function() {
    const bcur = get(boardCursor);
    this.boards = this.boards.filter((_, index) => index !== bcur);
    await this.SaveKanbanBoards();
  },
  deleteList: async function() {
    const bcur = get(boardCursor);
    const lcur = get(listCursor);
    this.boards[bcur].lists = this.boards[bcur].lists.filter((_, index) => index !== lcur);
    await this.SaveKanbanBoards();
  },
  deleteItem: async function() {
    const bcur = get(boardCursor);
    const lcur = get(listCursor);
    const icur = get(itemCursor);
    this.boards[bcur].lists[lcur].items = this.boards[bcur].lists[lcur].items.filter((_, index) => index !== icur);
    await this.SaveKanbanBoards();
  },
  newItemMsg: async function(msg) {
    const bcur = get(boardCursor);
    const lcur = get(listCursor);
    const icur = get(itemCursor);

    const notes = this.boards[bcur].lists[lcur].items[icur].notes;
    this.boards[bcur].lists[lcur].items[icur].notes = [
      msg,
      ...notes,
    ];
    await this.SaveKanbanBoards();
  },
  newItemApp: async function(app) {
    const bcur = get(boardCursor);
    const lcur = get(listCursor);
    const icur = get(itemCursor);

    this.boards[bcur].lists[lcur].items[icur].apps.push(
      app,
    );
    await this.SaveKanbanBoards();
  },
  appUpdate: async function(Apindex, app) {
    const bcur = get(boardCursor);
    const lcur = get(listCursor);
    const icur = get(itemCursor);

    this.boards[bcur].lists[lcur].items[icur].apps[Apindex] = app;
    await this.SaveKanbanBoards();
  },
  listUpdate: async function(list) {
    const bcur = get(boardCursor);
    const lcur = get(listCursor);

    this.boards[bcur].lists[lcur] = list;
    await this.SaveKanbanBoards();
  }
};

export const Kanban = writable(DefaultKanban);
