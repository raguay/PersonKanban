<script>
  import { onMount } from "svelte";
  import Board from "./components/Board.svelte";
  import { Kanban } from "./stores/Kanban.js";
  import * as App from "../wailsjs/go/main/App.js";

  let styles = {
    backgroundcolor: "blue",
    textcolor: "white",
    unselectTabColor: "lightgray",
    unselectTabTextColor: "black",
    selectTabColor: "lightblue",
    selectTabTextColor: "black",
    mainboardcolor: "lightblue",
    listcontainercolor: "lightblue",
    listbgcolor: "#9AC2FA",
    listtextcolor: "white",
    itembgcolor: "white",
    itemtextcolor: "black",
    font: '"Fira Code"',
    dialogBGColor: "lightblue",
    dialogTextColor: "black",
    kanbanInfo: "black",
  };

  onMount(async () => {
    //
    // Load the board information from the harddrive.
    //
    let kanbanStr = await App.ReadKanbanString();
    $Kanban = JSON.parse(kanbanStr);
    if ($Kanban.boards === null) $Kanban.boards = [];
    let styleStr = await App.ReadThemeString();
    styles = JSON.parse(styleStr);
    //
    // For debug purposes. NOTE: Remove when done testing.
    //
    window.Kanban = $Kanban;
  });

  async function addBoard() {
    var newID = 0;
    if ($Kanban.boards.length > 0) {
      $Kanban.boards.forEach((item) => {
        if (item.id > newID) newID = item.id;
      });
      newID = newID + 1;
    }
    $Kanban.boards.push({
      id: newID,
      name: "New Board",
      lists: [],
    });
    await SaveKanbanBoards($Kanban);
  }

  async function addList(e) {
    var newID = 0;
    if ($Kanban.boards[e.detail.board].lists.length > 0) {
      $Kanban.boards[e.detail.board].lists.map((list) => {
        if (list.id > newID) newID = list.id;
      });
      newID = newID + 1;
    }
    $Kanban.boards[e.detail.board].lists.push({
      id: newID,
      name: "New List",
      items: [],
    });
    await SaveKanbanBoards($Kanban);
  }

  async function addItem(e) {
    var newID = 0;
    if ($Kanban.boards[e.detail.board].lists[e.detail.list].items.length > 0) {
      $Kanban.boards[e.detail.board].lists[e.detail.list].items.map((item) => {
        if (item.id > newID) newID = item.id;
      });
      newID = newID + 1;
    }
    $Kanban.boards[e.detail.board].lists[e.detail.list].items.push({
      id: newID + 1,
      name: "New Item",
      description: "This should describe the card's function.",
      color: [],
      notes: [],
      apps: [],
    });
    await SaveKanbanBoards($Kanban);
  }

  async function deleteList(e) {
    $Kanban.boards[e.detail.board].lists = $Kanban.boards[
      e.detail.board
    ].lists.filter((list) => e.detail.list !== list.id);
    await SaveKanbanBoards($Kanban);
  }

  async function deleteItem(e) {
    $Kanban.boards[e.detail.board].lists[e.detail.list].items = $Kanban.boards[
      e.detail.board
    ].lists[e.detail.list].items.filter((item) => e.detail.item !== item.id);
    await SaveKanbanBoards($Kanban);
  }

  async function newItemMsg(e) {
    $Kanban.boards[e.detail.board].lists[e.detail.list].items[
      e.detail.item
    ].push(e.detail.msg);
    await SaveKanbanBoards($Kanban);
  }

  async function newItemApp(e) {
    $Kanban.boards.boards[e.detail.board].lists[e.detail.list].items[
      e.detail.item
    ].apps.push(e.detail.app);
    await SaveKanbanBoards($Kanban);
  }

  async function appUpdate(e) {
    $Kanban.boards.boards[e.detail.board].lists[e.detail.list].items[
      e.detail.item
    ].apps.map((app) => {
      if (app.id === e.detail.app.id) {
        app = e.detail.app;
      }
    });
    await SaveKanbanBoards($Kanban);
  }

  async function listUpdate(e) {
    $Kanban.boards[e.detail.board].lists.map((list) => {
      if (e.detail.list.id == list.id) {
        list = e.detail.list;
      }
    });
    await SaveKanbanBoards($Kanban);
  }

  async function SaveKanbanBoards(boards) {
    await App.SaveKanbanBoards(JSON.stringify(boards));
    $Kanban = boards;
  }
</script>

<div
  id="main"
  style="background-color: {styles.backgroundcolor}; 
                      color: {styles.textcolor};
                      font-family: {styles.font};"
>
  <Board
    {styles}
    on:saveBoad={async () => {
      await SaveKanbanBoards($Kanban);
    }}
    on:addboard={() => {
      addBoard();
    }}
    on:addlist={(e) => {
      addList(e);
    }}
    on:additem={(e) => {
      addItem(e);
    }}
    on:deleteList={(e) => {
      deleteList(e);
    }}
    on:deleteItem={deleteItem}
    on:newItemMsg={newItemMsg}
    on:newItemApp={newItemApp}
    on:appUpdate={appUpdate}
    on:listUpdate={listUpdate}
  />
</div>

<style>
  #main {
    position: absolute;
    top: 0px;
    left: 0px;
    display: flex;
    flex-direction: column;
    flex: 1fr;
    text-align: left;
    padding: 0px;
    margin: 0px;
    user-select: none;
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
  }

  #Header {
    display: flex;
    flex-direction: row;
    text-align: left;
    flex: 1fr;
  }

  #Header h1 {
    margin: 10px;
  }

  #Header h2 {
    margin: 20px 10px 10px auto;
  }

  :global(h1) {
    font-size: 24px !important;
    text-align: center;
  }
</style>
