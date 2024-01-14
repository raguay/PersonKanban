<script>
  import { onMount, tick } from "svelte";
  import Board from "./components/Board.svelte";
  import { Kanban } from "./stores/Kanban.js";
  import { keyHandler } from "./stores/keyHandler.js";
  import { boardCursor } from "./stores/boardCursor.js";
  //import { listCursor } from "./stores/listCursor.js";
  //import { itemCursor } from "./stores/itemCursor.js";
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
    fontsize: 16,
    dialogBGColor: "lightblue",
    dialogTextColor: "black",
    kanbanInfo: "black",
    cursorColor: "blue",
    cursorWidth: "10px",
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
        if (item.id >= newID) newID = item.id + 1;
      });
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
    var ind = 0;
    $Kanban.boards.map((board, index) => {
      if (board.id === e.detail.board) {
        board.lists.map((list) => {
          if (list.id >= newID) {
            newID = list.id + 1;
          }
        });
        ind = index;
      }
    });
    $Kanban.boards[ind].lists.push({
      id: newID,
      name: "New List",
      items: [],
    });
    await SaveKanbanBoards($Kanban);
  }

  async function addItem(e) {
    var newID = 0;
    var Boardind = 0;
    var Listind = 0;
    $Kanban.boards.map((board, bindex) => {
      if (board.id === e.detail.board) {
        Boardind = bindex;
        board.lists.map((list, lindex) => {
          if (list.id === e.detail.list) {
            Listind = lindex;
            list.items.map((item) => {
              if (item.id >= newID) {
                newID = item.id + 1;
              }
            });
          }
        });
      }
    });

    $Kanban.boards[Boardind].lists[Listind].items.push({
      id: newID,
      name: "New Item",
      description: "This should describe the card's function.",
      color: "",
      notes: [],
      apps: [],
    });
    await SaveKanbanBoards($Kanban);
  }

  async function deleteBoard(e) {
    await tick();
    $boardCursor = $boardCursor - 1;
    if ($boardCursor < 0) $boardCursor = 0;
    $Kanban.boards = $Kanban.boards.filter(
      (board) => board.id !== e.detail.board
    );
    await SaveKanbanBoards($Kanban);
  }

  async function deleteList(e) {
    $Kanban.boards.map((board) => {
      if (board.id === e.detail.board) {
        board.lists = board.lists.filter((list) => e.detail.list !== list.id);
      }
    });
    await SaveKanbanBoards($Kanban);
  }

  async function deleteItem(e) {
    $Kanban.boards.map((board) => {
      if (board.id === e.detail.board) {
        board.lists.map((list) => {
          if (list.id === e.detail.list) {
            list.items = list.items.filter(
              (item) => e.detail.item.id !== item.id
            );
          }
        });
      }
    });
    await SaveKanbanBoards($Kanban);
  }

  async function newItemMsg(e) {
    let Bdindex = 0;
    let Ltindex = 0;
    let Itindex = 0;
    let newid = 0;
    $Kanban.boards.map((board, bindex) => {
      if (board.id === e.detail.board) {
        Bdindex = bindex;
        board.lists.map((list, lindex) => {
          if (list.id === e.detail.list) {
            Ltindex = lindex;
            list.items.map((item, iindex) => {
              if (item.id === e.detail.item) {
                Itindex = iindex;
                if (item.notes.length > 0) {
                  item.notes.map((note) => {
                    if (note.id >= newid) newid = note.id + 1;
                  });
                }
              }
            });
          }
        });
      }
    });

    let notes = $Kanban.boards[Bdindex].lists[Ltindex].items[Itindex].notes;
    $Kanban.boards[Bdindex].lists[Ltindex].items[Itindex].notes = [
      e.detail.msg,
      ...notes,
    ];
    await SaveKanbanBoards($Kanban);
  }

  async function newItemApp(e) {
    let Bdindex = 0;
    let Ltindex = 0;
    let Itindex = 0;
    $Kanban.boards.map((board, bindex) => {
      if (board.id === e.detail.board) {
        Bdindex = bindex;
        board.lists.map((list, lindex) => {
          if (list.id === e.detail.list) {
            Ltindex = lindex;
            list.items.map((item, iindex) => {
              if (item.id === e.detail.item) {
                Itindex = iindex;
              }
            });
          }
        });
      }
    });

    $Kanban.boards[Bdindex].lists[Ltindex].items[Itindex].apps.push(
      e.detail.app
    );
    await SaveKanbanBoards($Kanban);
  }

  async function appUpdate(e) {
    let Bdindex = 0;
    let Ltindex = 0;
    let Itindex = 0;
    let Apindex = 0;
    $Kanban.boards.map((board, bindex) => {
      if (board.id === e.detail.board) {
        Bdindex = bindex;
        board.lists.map((list, lindex) => {
          if (list.id === e.detail.list) {
            Ltindex = lindex;
            list.items.map((item, iindex) => {
              if (item.id === e.detail.item) {
                Itindex = iindex;
                item.apps.map((app, aindex) => {
                  if (app.id === e.detail.app.id) {
                    Apindex = aindex;
                  }
                });
              }
            });
          }
        });
      }
    });

    $Kanban.boards[Bdindex].lists[Ltindex].items[Itindex].apps[Apindex] =
      e.detail.app;
    await SaveKanbanBoards($Kanban);
  }

  async function listUpdate(e) {
    let Bdindex = 0;
    let Ltindex = 0;
    $Kanban.boards.map((board, bindex) => {
      if (board.id === e.detail.board) {
        Bdindex = bindex;
        board.lists.map((list, lindex) => {
          if (list.id === e.detail.list.id) {
            Ltindex = lindex;
          }
        });
      }
    });
    $Kanban.boards[Bdindex].lists[Ltindex] = e.detail.list;
    await SaveKanbanBoards($Kanban);
  }

  async function SaveKanbanBoards(boards) {
    await App.SaveKanbanBoards(JSON.stringify(boards));
    $Kanban = boards;
  }
</script>

<svelte:window
  on:keydown={(e) => {
    if ($keyHandler !== null) $keyHandler(e);
  }}
/>

<div
  id="main"
  style="background-color: {styles.backgroundcolor}; 
         color: {styles.textcolor};
         font-family: {styles.font};
         font-size: {styles.fontsize}px;"
>
  <Board
    {styles}
    on:saveBoard={async () => {
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
    on:deleteboard={deleteBoard}
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

  :global(h1) {
    font-size: 18px !important;
    text-align: center;
  }
</style>
