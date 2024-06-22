import { writable, get } from "svelte/store";
import { metaboard } from "./metaboard.js";
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
    commandbarbgcolor: "#9AC2FA",
    commandbartextcolor: "white",
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
  SaveKanbanBoards: async function () {
    const mtboard = get(metaboard);
    await App.WriteFile(
      mtboard.metaboards[mtboard.cursor].loc,
      JSON.stringify(this.boards),
    );
  },
  LoadCurrentKanbanBoards: async function () {
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
    this.SaveKanbanBoards();
  },
  addBoard: async function () {
    await addBoardNamed("New Board", "");
  },
  addBoardNamed: async function (name, description) {
    //
    // Using the default styles as a template. Maybe change that in the future?
    //
    this.boards.push({
      name: name,
      description: description,
      desctype: "text",
      styles: this.defaultStyles,
      lists: [],
    });
    await this.SaveKanbanBoards();
  },
  addList: async function () {
    await this.addListNamed("New List");
  },
  addListNamed: async function (name) {
    const bcur = get(boardCursor);
    this.boards[bcur].lists.push({
      name: name,
      styles: this.defaultListStyle,
      items: [],
    });
    await this.SaveKanbanBoards();
  },
  addItem: async function () {
    await this.addItemNamed(
      "New Item",
      "This should describe the card's function.",
    );
  },
  addItemNamed: async function (name, description) {
    const bcur = get(boardCursor);
    const lcur = get(listCursor);
    this.boards[bcur].lists[lcur].items.push({
      name: name,
      description: description,
      notes: [],
      styles: this.defaultItemStyle,
      apps: [],
    });
    await this.SaveKanbanBoards();
  },
  deleteBoard: async function () {
    const bcur = get(boardCursor);
    this.boards = this.boards.filter((_, index) => index !== bcur);
    await this.SaveKanbanBoards();
  },
  deleteList: async function () {
    const bcur = get(boardCursor);
    const lcur = get(listCursor);
    this.boards[bcur].lists = this.boards[bcur].lists.filter(
      (_, index) => index !== lcur,
    );
    await this.SaveKanbanBoards();
  },
  deleteItem: async function () {
    const bcur = get(boardCursor);
    const lcur = get(listCursor);
    const icur = get(itemCursor);
    this.boards[bcur].lists[lcur].items = this.boards[bcur].lists[
      lcur
    ].items.filter((_, index) => index !== icur);
    await this.SaveKanbanBoards();
  },
  newItemMsg: async function (date, type, msg) {
    const bcur = get(boardCursor);
    const lcur = get(listCursor);
    const icur = get(itemCursor);

    const notes = this.boards[bcur].lists[lcur].items[icur].notes;
    this.boards[bcur].lists[lcur].items[icur].notes = [
      {
        date: date,
        type: type,
        info: msg,
      },
      ...notes,
    ];
    await this.SaveKanbanBoards();
  },
  newItemApp: async function (app) {
    const bcur = get(boardCursor);
    const lcur = get(listCursor);
    const icur = get(itemCursor);

    this.boards[bcur].lists[lcur].items[icur].apps.push(app);
    await this.SaveKanbanBoards();
  },
  appUpdate: async function (Apindex, app) {
    const bcur = get(boardCursor);
    const lcur = get(listCursor);
    const icur = get(itemCursor);

    this.boards[bcur].lists[lcur].items[icur].apps[Apindex] = app;
    await this.SaveKanbanBoards();
  },
  listUpdate: async function (list) {
    const bcur = get(boardCursor);
    const lcur = get(listCursor);

    this.boards[bcur].lists[lcur] = list;
    await this.SaveKanbanBoards();
  },
};

export const Kanban = writable(DefaultKanban);
