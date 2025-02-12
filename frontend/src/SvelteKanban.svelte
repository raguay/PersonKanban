<script>
  import { onMount, tick } from "svelte";
  import CommandBar from "./components/CommandBar.svelte";
  import MetaBoardList from "./components/MetaBoardList.svelte";
  import QuickBar from "./components/QuickBar.svelte";
  import List from "./components/List.svelte";
  import Preferences from "./components/Preferences.svelte";
  import { Kanban } from "./stores/Kanban.js";
  import { lastCommand } from "./stores/lastCommand.js";
  import { keyHandler } from "./stores/keyHandler.js";
  import { boardCursor } from "./stores/boardCursor.js";
  import { commandBar } from "./stores/commandBar.js";
  import { itemCursor } from "./stores/itemCursor";
  import { listCursor } from "./stores/listCursor";
  import { metaboard } from "./stores/metaboard.js";
  import { ctrlKey } from "./stores/ctrlKey.js";
  import { shiftKey } from "./stores/shiftKey.js";
  import { metaKey } from "./stores/metaKey.js";
  import { altKey } from "./stores/altKey.js";
  import { key } from "./stores/key.js";
  import { skipKey } from "./stores/skipKey.js";
  import { preferences } from "./stores/preferences.js";
  import * as App from "../wailsjs/go/main/App.js";

  let editNameFlag = false;
  let editField = null;
  let origKH = null;
  let acc = "";
  let keystate = 0;
  let command = null;
  let direction = "";
  let editItem = false;
  let quickBarOpen = false;

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
    $listCursor = -1;
    $itemCursor = -1;
    await $Kanban.LoadCurrentKanbanBoards();
    $Kanban = $Kanban;

    //
    // Setup the keyboard handler.
    //
    $keyHandler = listKeyHandler;

    //
    // Add Commands for the CommandBar.
    //
    $commandBar.commands = [];
    $commandBar.addCommand(
      "Open Preferences",
      openPreferences,
      "Opens the preferences for the currently selected item.",
      "text",
    );
    $commandBar.addCommand(
      "Add a New Board",
      addNewBoard,
      "Adds a new board to the list of boards.",
      "text",
    );
    $commandBar.addCommand(
      "Delete Current Board",
      deleteCurrentBoard,
      "<h3>Delecte Current board</h3><p>This command will delete the current board.</p>",
      "html",
    );
    $commandBar.addCommand(
      "Delete Current List",
      deleteCurrentList,
      "### Delete Current List \n\nThis command will delete the current list.",
      "md",
    );
    $commandBar.addCommand(
      "Delete Current Item",
      deleteCurrentItem,
      "### Delete Current Item\n\nThis command will delete the current item.",
      "md",
    );
    $commandBar.addCommand(
      "Add New List",
      addNewList,
      "### Add New List\n\nThis will add a new list.",
      "md",
    );
    $commandBar.addCommand(
      "Add New Item",
      addNewItem,
      "### Add New Item\n\nThis will add a new item.",
      "md",
    );
    $commandBar.addCommand(
      "Open Current Item",
      openItem,
      "### Open Current Item\n\nThis will open the current item.",
      "md",
    );
    $commandBar.addCommand(
      "Move Board Cursor Left",
      moveBoardCursorLeft,
      "### Move Board Cursor Left\n\nThis will move the board cursor left.",
      "md",
    );
    $commandBar.addCommand(
      "Move Board Cursor Right",
      moveBoardCursorRight,
      "### Move Board Cursor Right\n\nThis will move the board cursor right.",
      "md",
    );
    $commandBar.addCommand(
      "Move List Cursor Left",
      moveListCursorLeft,
      "### Move List Cursor Left\n\nThis will move the list cursor left.",
      "md",
    );
    $commandBar.addCommand(
      "Move List Cursor Right",
      moveListCursorRight,
      "### Move List Cursor Right\n\nThis will move the list cursor right.",
      "md",
    );
    $commandBar.addCommand(
      "Move Item Cursor Up",
      moveItemCursorUp,
      "### Move Item Cursor Up\n\nThis will move the item cursor up.",
      "md",
    );
    $commandBar.addCommand(
      "Move Item Cursor Down",
      moveItemCursorDown,
      "### Move Item Cursor Down\n\nThis will move the item cursor down.",
      "md",
    );
    $commandBar.addCommand(
      "Quit",
      quit,
      "### quit\n\nThis will exit out of the program.",
      "md",
    );
    $commandBar.addCommand(
      "Edit List Title",
      editListTitle,
      "### Edit List Title\n\nEdit the title for the current list.",
      "md",
    );
    $commandBar.addCommand(
      "Edit Board Name",
      editBoardName,
      "### Edit Board Name\n\nEdit the name of the current board.",
      "md",
    );
  });

  function showMetaboards() {
    $metaboard.setShowing();
    $metaboard = $metaboard;
  }

  function editoff() {
    editItem = false;
    $Kanban = $Kanban;
  }

  function openPreferences() {
    $preferences.showing = true;
    $preferences.keyboardHandler = listKeyHandler;
    $preferences = $preferences;
    $Kanban = $Kanban;
  }

  function editListTitle() {
    editItem = true;
    $Kanban = $Kanban;
  }

  async function editBoardName() {
    let num = $boardCursor;
    await editName(num);
  }

  async function addNewBoard() {
    await $Kanban.addBoard();
    $Kanban = $Kanban;
  }
  async function addNewList() {
    await $Kanban.addList();
    $Kanban = $Kanban;
  }

  async function addNewItem() {
    await $Kanban.addItem();
    $Kanban = $Kanban;
  }

  async function deleteCurrentBoard() {
    await tick();
    await $Kanban.deleteBoard();
    $boardCursor = $boardCursor - 1;
    if ($boardCursor < 0) $boardCursor = 0;
    $listCursor = 0;
    $itemCursor = -1;
    $Kanban = $Kanban;
  }

  async function deleteCurrentList() {
    //
    // Wait for settling of the user interface.
    //
    await tick();
    await $Kanban.deleteList();
    $listCursor = $listCursor - 1;
    if ($listCursor < 0) $listCursor = 0;
    $itemCursor = -1;
    $Kanban = $Kanban;
  }

  async function deleteCurrentItem() {
    //
    // Wait for settling of the user interface.
    //
    await tick();
    await $Kanban.deleteItem();
    $itemCursor = $itemCursor - 1;
    if ($itemCursor < 0) $itemCursor = 0;
    $Kanban = $Kanban;
  }

  async function editName(num) {
    if (origKH === null) {
      origKH = $keyHandler;
      $keyHandler = null;
    }
    $boardCursor = num;
    editNameFlag = true;
    await tick();
    editField.focus();
  }

  function setBoard(ind) {
    $boardCursor = ind;
  }

  function listKeyHandler(e) {
    $ctrlKey = e.ctrlKey;
    $shiftKey = e.shiftKey;
    $metaKey = e.metaKey;
    $altKey = e.altKey;
    $key = e.key;

    //
    // If skpkey is true, don't process the key.
    //
    if (!$skipKey) {
      processKey(e);
    }
    $skipKey = false;
  }

  function clearState() {
    //
    // Clear out the variables used in processing the keyboard commands.
    //
    $listCursor = $listCursor;
    $Kanban = $Kanban;
    keystate = 0;
    command = null;
    direction = "";
    acc = "";
  }

  async function processKey(e) {
    //
    // This is just normal key processing. Run the command for that key.
    //
    e.preventDefault();
    switch (keystate) {
      case 0:
        //
        // keystate 0 is the main entry state. Get the command and accumulator values.
        //
        switch ($key) {
          case " ":
            quickBarOpen = true;
            command = null;
            break;

          case "a":
            let thisboard = $Kanban.boards[$boardCursor];
            if ($listCursor === -1) {
              if (
                typeof thisboard.lists !== "undefined" ||
                thisboard.lists.length !== 0
              ) {
                command = addNewBoard;
                $lastCommand = "Add New Board";
              } else {
                command = addNewList;
                $lastCommand = "Add New List";
              }
            } else if ($itemCursor <= -1) {
              command = addNewList;
              $lastCommand = "Add New List";
            } else {
              command = addNewItem;
              $lastCommand = "Add New Item";
            }
            break;

          case "e":
            if ($itemCursor < 0 && $listCursor >= 0) {
              command = editListTitle;
              $lastCommand = "Edit List Title";
            } else if ($itemCursor < 0 && $listCursor < 0) {
              command = editBoardName;
              $lastCommand = "Edit Board Name";
            }
            break;

          case "x":
            if ($listCursor === -1) {
              command = deleteCurrentBoard;
              $lastCommand = "Delete Current Board";
            } else if ($itemCursor <= -1) {
              command = deleteCurrentList;
              $lastCommand = "Delete Current List";
            } else {
              command = deleteCurrentItem;
              $lastCommand = "Delete Current Item";
            }
            break;

          case "h":
            if ($listCursor === -1) {
              command = moveBoardCursorLeft;
              $lastCommand = "Move Board Cursor Left";
            } else {
              command = moveListCursorLeft;
              $lastCommand = "Move List Cursor Left";
            }
            break;

          case "k":
            command = moveItemCursorUp;
            $lastCommand = "Move Item Cursor Up";
            break;

          case "j":
            command = moveItemCursorDown;
            $lastCommand = "Move Item Cursor Down";
            break;

          case "l":
            if ($listCursor === -1) {
              command = moveBoardCursorRight;
              $lastCommand = "Move Board Cursor Right";
            } else {
              command = moveListCursorRight;
              $lastCommand = "Move List Cursor Right";
            }
            break;

          case "b":
            command = gotoBoard;
            break;

          case "m":
            if ($listCursor === -1) {
              command = moveBoard;
              $lastCommand = "Move Current Board";
            } else if ($itemCursor <= -1) {
              command = moveList;
              $lastCommand = "Move Current List";
            } else {
              command = moveItem;
              $lastCommand = "Move Current Item";
            }
            //
            // Goto the one state to capture the direction.
            //
            keystate = 1;
            break;

          case "t":
            //
            // Go to the metaboards dialog.
            //
            command = showMetaboards;
            acc = "";
            $lastCommand = "Show Metaboards";
            break;

          case "p":
            //
            // Open Preferences.
            //
            command = openPreferences;
            $lastCommand = "Open Preferences";
            break;

          case ".":
            command = $commandBar.getCommand($lastCommand).command;
            break;

          case "Enter":
            if ($listCursor !== -1 && $itemCursor >= 0) {
              command = openItem;
            }
            break;

          case "Escape":
            if ($itemCursor >= 0) {
              $itemCursor = -1;
            } else if ($itemCursor < 0) $listCursor = -1;
            clearState();
            $keyHandler = listKeyHandler;
            break;

          case ":":
            if ($commandBar.showing) {
              $commandBar.clearShowing();
              $commandBar = $commandBar;
            } else {
              $commandBar.setShowing();
              $commandBar = $commandBar;
            }
            break;

          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            acc = acc + $key;
            break;

          default:
            acc = "";
            keystate = 0;
            command = null;
            break;
        }
        break;
      case 1:
        //
        // This case is for getting the direction for a command.
        //
        switch ($key) {
          case "h":
            keystate = 0;
            direction = "l";
            break;

          case "k":
            keystate = 0;
            direction = "u";
            break;

          case "j":
            direction = "d";
            keystate = 0;
            break;

          case "l":
            direction = "r";
            keystate = 0;
            break;

          default:
            //
            // A valid direction wasn't given. Abort the command.
            //
            clearState();
            break;
        }
        break;
    }
    if (keystate === 0) {
      //
      // If a command is set, do the command as many times as the acc says.
      //
      if (command !== null) {
        //
        // Get the acc amount. If blank, at least run the command once.
        //
        let times = getAcc();

        //
        // Execute the command the correct number of times.
        //
        for (var i = 0; i < times; i++) {
          command();
        }

        //
        // After executing the command, we need to set the states back to the beginning.
        //
        clearState();
      }
    }
  }

  //
  // Commands for working with the boards, lists, and items.
  //
  function getAcc() {
    let times = 0;
    if (acc === "") {
      times = 1;
    } else {
      times = parseInt(acc);
    }
    return times;
  }

  function openItem() {
    if ($itemCursor >= 0) editItem = true;
  }

  function moveBoardCursorLeft() {
    let newcursor = $boardCursor - 1;
    if (newcursor < 0) newcursor = 0;
    if (newcursor != $boardCursor) {
      $boardCursor = newcursor;
    }
  }

  function moveBoardCursorRight() {
    let newcursor = $boardCursor + 1;
    if (newcursor >= $Kanban.boards.length)
      newcursor = $Kanban.boards.length - 1;
    if (newcursor != $boardCursor) {
      $boardCursor = newcursor;
    }
  }

  function gotoBoardCommand(brd) {
    if (brd < 0) brd = 0;
    if (brd >= $Kanban.boards.length) brd = $Kanban.boards.length - 1;
    $boardCursor = brd;
  }

  function gotoBoard() {
    gotoBoardCommand(getAcc() - 1);
  }

  function moveBoard() {
    moveBoardCommand(direction);
  }

  async function moveBoardCommand(dir) {
    let newboardindex = $boardCursor;
    switch (dir) {
      case "l":
        newboardindex--;
        break;

      case "r":
        newboardindex++;
        break;
    }
    if (newboardindex < 0) newboardindex = 0;
    if (newboardindex >= $Kanban.boards.length)
      newboardindex = $Kanban.boards.length - 1;
    if (newboardindex !== $boardCursor) {
      //
      // It's a valid move. Move it.
      //
      let orig = structuredClone($Kanban.boards[$boardCursor]);
      $Kanban.boards[$boardCursor] = structuredClone(
        $Kanban.boards[newboardindex],
      );
      $Kanban.boards[newboardindex] = structuredClone(orig);
      $boardCursor = newboardindex;
      await $Kanban.SaveKanbanBoards();
    }
  }

  function moveItem() {
    moveItemCommand(direction);
  }

  async function moveItemCommand(dir) {
    if ($listCursor >= 0 && $itemCursor >= 0) {
      let newitemindex = $itemCursor;
      switch (dir) {
        case "u":
          newitemindex--;
          break;

        case "d":
          newitemindex++;
          break;
      }
      if (newitemindex < 0) newitemindex = 0;
      if (
        $Kanban.boards[$boardCursor].lists[$listCursor].items.length - 1 <
        newitemindex
      )
        newitemindex =
          $Kanban.boards[$boardCursor].lists[$listCursor].items.length - 1;
      if (newitemindex !== $itemCursor) {
        //
        // We have a valid move.
        //
        let orig = structuredClone(
          $Kanban.boards[$boardCursor].lists[$listCursor].items[$itemCursor],
        );
        $Kanban.boards[$boardCursor].lists[$listCursor].items[$itemCursor] =
          structuredClone(
            $Kanban.boards[$boardCursor].lists[$listCursor].items[newitemindex],
          );
        $Kanban.boards[$boardCursor].lists[$listCursor].items[newitemindex] =
          structuredClone(orig);
        $itemCursor = newitemindex;
      } else {
        //
        // It was a move to a different list.
        //
        let newlistindex = $listCursor;
        switch (dir) {
          case "l":
            newlistindex--;
            break;

          case "r":
            newlistindex++;
            break;
        }
        if (newlistindex < 0) newlistindex = 0;
        if ($Kanban.boards[$boardCursor].lists.length - 1 < newlistindex)
          newlistindex = $Kanban.boards[$boardCursor].lists.length - 1;
        if (newlistindex !== $listCursor) {
          //
          // Move to the new list index.
          //
          let item = structuredClone(
            $Kanban.boards[$boardCursor].lists[$listCursor].items[$itemCursor],
          );
          $Kanban.boards[$boardCursor].lists[$listCursor].items.splice(
            $itemCursor,
            1,
          );
          $Kanban.boards[$boardCursor].lists[newlistindex].items = [
            item,
            ...$Kanban.boards[$boardCursor].lists[newlistindex].items,
          ];
          $listCursor = newlistindex;
          $itemCursor = 0;
        }
      }
      await $Kanban.SaveKanbanBoards();
    }
  }

  function moveList() {
    moveListCommand(direction);
  }

  async function moveListCommand(dir) {
    if ($listCursor >= 0) {
      let newlistindex = $listCursor;
      switch (dir) {
        case "l":
          newlistindex--;
          break;

        case "r":
          newlistindex++;
          break;
      }
      if (newlistindex < 0) newlistindex = 0;
      if ($Kanban.boards[$boardCursor].lists.length - 1 < newlistindex)
        newlistindex = $Kanban.boards[$boardCursor].lists.length - 1;
      if (newlistindex !== $listCursor) {
        //
        // We have a valid move.
        //
        let orig = structuredClone(
          $Kanban.boards[$boardCursor].lists[$listCursor],
        );
        $Kanban.boards[$boardCursor].lists[$listCursor] = structuredClone(
          $Kanban.boards[$boardCursor].lists[newlistindex],
        );
        $Kanban.boards[$boardCursor].lists[newlistindex] =
          structuredClone(orig);
        $listCursor = newlistindex;
      }
      await $Kanban.SaveKanbanBoards();
    }
  }

  function moveListCursorLeft() {
    if ($listCursor >= 0) {
      //
      // Move to the list to the left if any.
      //
      $listCursor = $listCursor - 1;
      if ($listCursor < 0) $listCursor = 0;
      if (
        $itemCursor >=
        $Kanban.boards[$boardCursor].lists[$listCursor].items.length
      )
        $itemCursor =
          $Kanban.boards[$boardCursor].lists[$listCursor].items.length - 1;
    }
  }

  function moveListCursorRight() {
    //
    // Move to the list to the right if any.
    //
    $listCursor = $listCursor + 1;
    if ($listCursor >= $Kanban.boards[$boardCursor].lists.length)
      $listCursor = $Kanban.boards[$boardCursor].lists.length - 1;
    if (
      $itemCursor >=
      $Kanban.boards[$boardCursor].lists[$listCursor].items.length
    )
      $itemCursor =
        $Kanban.boards[$boardCursor].lists[$listCursor].items.length - 1;
  }

  function moveItemCursorUp() {
    //
    // Move to the list item up one if any.
    //
    if ($listCursor === -1) $listCursor = 0;
    $itemCursor = $itemCursor - 1;
    if ($itemCursor < 0) $itemCursor = 0;
  }

  function moveItemCursorDown() {
    //
    // Move to the list item down one if any.
    //
    if ($listCursor === -1) {
      $listCursor = 0;
    } else {
      let list = $Kanban.boards[$boardCursor].lists[$listCursor];
      if (typeof list.items === "undefined" || list.items.length === 0) {
        $itemCursor = 0;
      } else {
        $itemCursor = $itemCursor + 1;
        if ($itemCursor >= list.items.length)
          $itemCursor = list.items.length - 1;
      }
    }
  }

  async function quit() {
    await App.Quit();
  }
</script>

<svelte:window
  on:keydown={(e) => {
    if ($keyHandler !== null) $keyHandler(e);
  }}
/>

{#if $Kanban.boards.length > 0}
  <div id="MainBoard">
    <div id="tabs">
      {#if $Kanban.boards.length > 0}
        {#each $Kanban.boards as board, index}
          {#if $boardCursor === index}
            <div
              class="tab"
              style="background-color: {$Kanban.boards[$boardCursor].styles
                .selectTabColor}; color: {$Kanban.boards[$boardCursor].styles
                .selectTabTextColor}"
              data-key={index}
              on:dblclick={(e) => {
                editName(index);
              }}
            >
              <span
                style="background-color: {$Kanban.boards[$boardCursor].styles
                  .selectTabColor}; color: {$Kanban.boards[$boardCursor].styles
                  .selectTabTextColor}"
                class="tabName"
              >
                {#if editNameFlag}
                  <input
                    type="text"
                    bind:value={board.name}
                    bind:this={editField}
                    on:keydown={async (e) => {
                      if (e.code === "Enter") {
                        editNameFlag = false;
                        $keyHandler = origKH;
                        origKH = null;
                        await $Kanban.SaveKanbanBoards();
                      }
                    }}
                    on:blur={async () => {
                      $keyHandler = origKH;
                      origKH = null;
                      editNameFlag = false;
                      await $Kanban.SaveKanbanBoards();
                    }}
                  />
                {:else}
                  {board.name}
                {/if}
              </span>
            </div>
          {:else}
            <div
              class="tab"
              style="background-color: {$Kanban.boards[$boardCursor].styles
                .unselectTabColor}; color: {$Kanban.boards[$boardCursor].styles
                .unselectTabTextColor}"
              data-key={index}
              on:click={() => {
                setBoard(index);
              }}
            >
              <span
                class="tabName"
                style="background-color: {$Kanban.boards[$boardCursor].styles
                  .unselectTabColor}; color: {$Kanban.boards[$boardCursor]
                  .styles.unselectTabTextColor}"
              >
                {board.name}
              </span>
            </div>
          {/if}
        {/each}
      {/if}
      <div
        class="tab"
        style="background-color: {$Kanban.boards[$boardCursor].styles
          .unselectTabColor}; color: {$Kanban.boards[$boardCursor].styles
          .unselectTabTextColor}"
        data-key={-1}
        on:click={(e) => {
          addNewBoard();
        }}
      >
        <span
          class="tabName"
          style="background-color: {$Kanban.boards[$boardCursor].styles
            .unselectTabColor};
                   color: {$Kanban.boards[$boardCursor].styles
            .unselectTabTextColor};
                   font-size: 30px; line-height: 20px;"
        >
          +
        </span>
      </div>
    </div>
    {#if $Kanban.boards.length > 0}
      <div
        id="ListsContainer"
        style="background-color: {$Kanban.boards[$boardCursor].styles
          .listcontainercolor};"
      >
        {#if $Kanban.boards[$boardCursor].lists.length > 0}
          {#each $Kanban.boards[$boardCursor].lists as _, index}
            <List
              boardcur={$boardCursor}
              listcur={index}
              edit={$listCursor === index ? editItem : false}
              {editoff}
            />
          {/each}
        {/if}
        <div
          id="addList"
          on:click={() => {
            addNewList();
          }}
        >
          <p>+ New List</p>
        </div>
      </div>
    {/if}
  </div>
{/if}

{#if $preferences.showing}
  <Preferences />
{/if}

{#if $commandBar.showing}
  <CommandBar />
{/if}

{#if $metaboard.showing}
  <MetaBoardList />
{/if}

{#if quickBarOpen}
  <QuickBar
    on:close={() => {
      quickBarOpen = false;
    }}
  />
{/if}

<style>
  :global(h1) {
    font-size: 18px !important;
    text-align: center;
    overflow: hidden;
  }

  :global(body) {
    margin: 0px;
    padding: 0px;
    width: 100%;
    height: 100vh;
    user-select: none;
    overflow: hidden;
    background-color: argba(0, 0, 0, 0);
    border-radius: 10px;
    border: solid 0px transparent;
  }

  #MainBoard {
    position: absolute;
    top: 0px;
    left: 0px;
    display: flex;
    flex: 1fr;
    flex-direction: column;
    margin: 0px;
    height: 100vh;
    width: 100%;
    margin: 0px;
    padding: 0px;
    min-height: 100vh;
    min-width: 100%;
    background-color: transparent;
  }

  #tabs {
    display: flex;
    flex-direction: row;
    margin: 0px 10px 0px 0px;
    overflow-x: auto;
    overflow-y: hidden;
    background-color: transparent;
  }

  #tabs::-webkit-scrollbar {
    height: 6px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 6px;
  }

  #tabs::-webkit-scrollbar-thumb {
    height: 6px;
    background-color: rgba(10, 10, 10, 0.5);
    border-radius: 6px;
  }

  .tab {
    border-top: 3px gray;
    border-right: 3px gray;
    border-left: 3px gray;
    border-bottom: 0px;
    border-radius: 20px 5px 0px 0px;
    height: 1em;
    padding: 10px;
    cursor: pointer;
    user-select: none;
    --wails-draggable: drag;
  }

  .tab span input[type="text"] {
    background-color: rgba(255, 255, 255, 0.3);
    margin: 0px;
    padding: 0px 8px;
    border-radius: 10px;
  }

  .tabName {
    background-color: white;
    color: black;
    margin: 5px;
    white-space: nowrap;
  }

  #addList {
    padding: 30px;
    width: 100px;
    max-width: 100px;
    min-width: 100px;
    background-color: rgba(255, 255, 255, 0.3);
    margin: auto 20px auto 20px;
    cursor: pointer;
    text-decoration: none;
    user-select: none;
    border-radius: 10px;
    border: 5px solid transparent;
    text-align: center;
  }

  #ListsContainer {
    display: flex;
    flex-direction: row;
    flex: 1;
    margin: 0px;
    overflow-x: auto;
    overflow-y: hidden;
    border: 3px solid transparent;
    border-radius: 0px 10px 10px 10px;
  }

  #ListsContainer::-webkit-scrollbar {
    height: 6px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 6px;
  }

  #ListsContainer::-webkit-scrollbar-thumb {
    height: 6px;
    background-color: rgba(10, 10, 10, 0.5);
    border-radius: 6px;
  }
</style>
