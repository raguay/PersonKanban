<script>
  import { onMount, tick } from "svelte";
  import Board from "./components/Board.svelte";
  import CommandBar from "./components/CommandBar.svelte";
  import MetaBoardList from "./components/MetaBoardList.svelte";
  import { Kanban } from "./stores/Kanban.js";
  import { keyHandler } from "./stores/keyHandler.js";
  import { boardCursor } from "./stores/boardCursor.js";
  import { commandBar } from "./stores/commandBar.js";
  import { itemCursor } from "./stores/itemCursor";
  import { listCursor } from "./stores/listCursor";
  import { metaboard } from "./stores/metaboard.js";
  import * as App from "../wailsjs/go/main/App.js";

  let defaultStyles = {
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
  };

  let defaultListStyle = {
    listbgcolor: "#9AC2FA",
    cursorColor: "blue",
    cursorText: "white",
    cursorWidth: "10px",
    dialogBGColor: "lightblue",
    dialogTextColor: "black",
    listtextcolor: "white",
  };

  let defaultItemStyle = {
    itembgcolor: "white",
    cursorColor: "blue",
    cursorText: "white",
    cursorWidth: "10px",
    dialogBGColor: "lightblue",
    dialogTextColor: "black",
    itemtextcolor: "black",
  };

  onMount(async () => {
    //
    //
    // Load the metaboards.
    //
    await $metaboard.loadMetaBoards();

    //
    // Load the default board information from the harddrive.
    //
    $boardCursor = 0;
    const hdir = await App.GetHomeDir();
    const configdir = await App.AppendPath(hdir, ".config");
    const kbcnfgdir = await App.AppendPath(configdir, "PersonKanban");
    const kanbanfile = await App.AppendPath(kbcnfgdir, "kanban.json");
    if (await App.FileExists(kbcnfgdir)) {
      //
      // The directory exist, so read the config file.
      //
      $Kanban = JSON.parse(
        await App.ReadFile($metaboard.metaboards[$metaboard.cursor].loc),
      );
    } else {
      //
      // Create the metaboards.json file.
      //
      $Kanban = {
        boards: [],
      };
    }
    if ($Kanban.boards.length === 0) {
      //
      // Create the default board if there are no boards.
      //
      await addBoard();
    }

    //
    // Make sure all the boards have their own style and information.
    //
    let boards = $Kanban.boards;
    boards.forEach((brd, key, arr) => {
      arr[key].styles = defaultStyles;
      arr[key].description = "";
      arr[key].desctype = "text";
      arr[key].lists.forEach((lst, key2, arr2) => {
        arr2[key2].styles = defaultListStyle;
        lst.items.forEach((itm, key3, arr3) => {
          arr3[key3].styles = defaultItemStyle;
        });
      });
    });
    $Kanban.boards = boards;
    $Kanban = $Kanban;

    //
    // Save the board information.
    //
    await SaveKanbanBoards($Kanban);
  });

  async function SaveKanbanBoards(kbstruct) {
    await App.WriteFile(
      $metaboard.metaboards[$metaboard.cursor].loc,
      JSON.stringify(kbstruct),
    );
    $Kanban = kbstruct;
  }

  async function addBoard() {
    var newID = 0;
    if ($Kanban.boards.length > 0) {
      $Kanban.boards.forEach((item) => {
        if (item.id >= newID) newID = item.id + 1;
      });
    }

    //
    // Using the default styles as a template. Maybe change that in the future?
    //
    $Kanban.boards.push({
      id: newID,
      name: "New Board",
      description: "",
      desctype: "text",
      styles: defaultStyles,
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
      styles: defaultListStyle,
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
      notes: [],
      styles: defaultItemStyle,
      apps: [],
    });
    await SaveKanbanBoards($Kanban);
  }

  async function deleteBoard(e) {
    //
    // Wait for settling of the user interface.
    //
    await tick();
    $boardCursor = $boardCursor - 1;
    if ($boardCursor < 0) $boardCursor = 0;
    $Kanban.boards = $Kanban.boards.filter(
      (board) => board.id !== e.detail.board,
    );
    await SaveKanbanBoards($Kanban);
  }

  async function deleteList(e) {
    //
    // Wait for settling of the user interface.
    //
    await tick();
    $Kanban.boards.map((board) => {
      if (board.id === e.detail.board) {
        board.lists = board.lists.filter((list) => e.detail.list !== list.id);
        if (board.lists.length <= $listCursor) {
          $listCursor = board.lists.length - 1;
        }
      }
    });
    await SaveKanbanBoards($Kanban);
  }

  async function deleteItem(e) {
    //
    // Wait for settling of the user interface.
    //
    await tick();
    $Kanban.boards.map((board) => {
      if (board.id === e.detail.board) {
        board.lists.map((list) => {
          if (list.id === e.detail.list) {
            list.items = list.items.filter(
              (item) => e.detail.item.id !== item.id,
            );
            if (list.items.length <= $itemCursor) {
              $itemCursor = list.items.length - 1;
            }
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
      e.detail.app,
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
</script>

<svelte:window
  on:keydown={(e) => {
    if ($keyHandler !== null) $keyHandler(e);
  }}
/>

{#if $Kanban.boards.length > 0}
  <div
    id="main"
    style="background-color:
    {$Kanban.boards[$boardCursor].styles.backgroundcolor};
         color: {$Kanban.boards[$boardCursor].styles.textcolor};
         font-family: {$Kanban.boards[$boardCursor].styles.font};
         font-size: {$Kanban.boards[$boardCursor].styles.fontsize}px;"
  >
    <Board
      styles={$Kanban.boards[$boardCursor].styles}
      on:saveBoard={async () => {
        await SaveKanbanBoards($Kanban);
      }}
      on:addboard={addBoard}
      on:addlist={addList}
      on:additem={addItem}
      on:deleteList={deleteList}
      on:deleteItem={deleteItem}
      on:newItemMsg={newItemMsg}
      on:newItemApp={newItemApp}
      on:appUpdate={appUpdate}
      on:listUpdate={listUpdate}
      on:deleteboard={deleteBoard}
    />
  </div>
{/if}

{#if $commandBar.showing}
  <CommandBar />
{/if}

{#if $metaboard.showing}
  <MetaBoardList />
{/if}

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
