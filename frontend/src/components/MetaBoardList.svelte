<script>
  import { onMount, afterUpdate } from "svelte";
  import { keyHandler } from "../stores/keyHandler.js";
  import { ctrlKey } from "../stores/ctrlKey.js";
  import { shiftKey } from "../stores/shiftKey.js";
  import { metaKey } from "../stores/metaKey.js";
  import { altKey } from "../stores/altKey.js";
  import { key } from "../stores/key.js";
  import { metaboard } from "../stores/metaboard.js";
  import { Kanban } from "../stores/Kanban.js";
  import { boardCursor } from "../stores/boardCursor.js";
  import { listCursor } from "../stores/listCursor.js";
  import { itemCursor } from "../stores/itemCursor.js";
  import { commandBar } from "../stores/commandBar.js";
  import * as App from "../../wailsjs/go/main/App.js";

  let origKeyboardHandler = null;
  let handlekey = true;
  let addedit = false;
  let add = true;
  let boardName = "";
  let boardDesc = "";
  let boardDescType = "text";
  let boardLoc = "";
  let itemDiv = null;

  onMount(() => {
    //
    // Save the original handler and install our new one.
    //
    if ($keyHandler !== null) {
      origKeyboardHandler = $keyHandler;
      $keyHandler = KeyboardHandler;
    }

    return () => {
      if (origKeyboardHandler !== null) {
        $keyHandler = origKeyboardHandler;
      }
    };
  });

  afterUpdate(() => {
    //
    // Make sure the cursor is fully visible by scrolling.
    //
    if (itemDiv !== null) {
      itemDiv.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  });

  async function KeyboardHandler(e) {
    $ctrlKey = e.ctrlKey;
    $shiftKey = e.shiftKey;
    $metaKey = e.metaKey;
    $altKey = e.altKey;
    $key = e.key;

    //
    // Handle the keyboard if not in an input.
    //
    if (handlekey) {
      //
      // Take over the keyboard!
      //
      e.preventDefault();
      //
      // State 0 is the main entry state. Get the command and accumulator values.
      //
      switch ($key) {
        case "a":
          //
          // Add a new metaboard.
          //
          newMetaBoard();
          break;

        case "e":
          //
          // Edit the current board information.
          //
          editCurrentMetaBoard();
          break;

        case "x":
          //
          // Remove the metaboard.
          //
          deleteCurrentMetaboard();
          break;

        case "j":
        case "ArrowDown":
          $metaboard.incCursor();
          $metaboard = $metaboard;
          break;

        case "k":
        case "ArrowUp":
          $metaboard.decCursor();
          $metaboard = $metaboard;
          break;

        case "Enter":
          await gotoMetaBoard($metaboard.cursor);
          close(e);
          break;

        case "Escape":
          if (addedit) {
            addedit = false;
          } else {
            close(e);
          }
          break;

        default:
          break;
      }
    } else {
      if (e.key === "Enter") {
        close(e);
      }
    }
  }

  function close(e) {
    e.preventDefault();
    e.stopPropagation();
    $metaboard.clearShowing();
    addedit = false;
    $metaboard = $metaboard;
    if (origKeyboardHandler !== null) {
      $keyHandler = origKeyboardHandler;
      origKeyboardHandler = null;
    }
  }

  async function deleteCurrentMetaboard() {
    await deleteMetaboard($metaboard.cursor);
  }

  async function deleteMetaboard(cur) {
    //
    // Remove the metaboard at the cursor location.
    //
    $metaboard.metaboards = $metaboard.metaboards.filter((item, key) => {
      if (key !== cur) return item;
    });
    await $metaboard.saveMetaBoards();
    if ($metaboard.cursor == cur) {
      $metaboard.cursor = $metaboard.cursor - 1;
      if ($metaboard.cursor < 0) $metaboard.cursor = 0;
    }
    $metaboard = $metaboard;
  }

  async function gotoMetaBoard(brdcursor) {
    $metaboard.cursor = brdcursor;
    if (await App.FileExists($metaboard.metaboards[brdcursor].loc)) {
      //
      // The file is there. Therefore, read it an apply it.
      //
      await $Kanban.LoadCurrentKanbanBoards();
      $metaboard.clearShowing();
    } else {
      //
      // The file hasn't been created yet. Create it and set it.
      //
      $Kanban.boards = [];
      let cmd = $commandBar.getCommand("Add a New Board");
      cmd.command();
      $metaboard.clearShowing();
    }
    $Kanban = $Kanban;
    $boardCursor = 0;
    $listCursor = -1;
    $itemCursor = -1;
  }

  function newMetaBoard() {
    boardName = "";
    boardDesc = "";
    boardDescType = "text";
    boardLoc = "";
    addedit = true;
    add = true;
    handlekey = false;
  }

  function editCurrentMetaBoard() {
    editMetaBoard($metaboard.cursor);
  }

  function editMetaBoard(board) {
    addedit = true;
    add = false;
    let mb = $metaboard.metaboards[board];
    boardName = mb.name;
    boardDesc = mb.description;
    boardDescType = mb.type;
    boardLoc = mb.loc;
    handlekey = false;
  }

  async function saveMetaBoard() {
    if (add) {
      $metaboard.addmetaboard(boardName, boardDesc, boardDescType, boardLoc);
    } else {
      //
      // This is for editing. Save the Edit.
      //
      $metaboard.metaboards[$metaboard.cursor].name = boardName;
      $metaboard.metaboards[$metaboard.cursor].description = boardDesc;
      $metaboard.metaboards[$metaboard.cursor].type = boardDescType;
      $metaboard.metaboards[$metaboard.cursor].loc = boardLoc;
    }
    await $metaboard.saveMetaBoards();
    $metaboard = $metaboard;
    addedit = false;
    handlekey = true;
  }
</script>

<div id="MBBackground">
  <div
    id="metaboardlist"
    style="background-color: {$Kanban.boards[$boardCursor].styles
      .dialogBGColor};
           color: {$Kanban.boards[$boardCursor].styles.dialogTextColor};
           font-family: {$Kanban.boards[$boardCursor].styles.font};
           font-size: {$Kanban.boards[$boardCursor].styles.fontsize}px;"
  >
    {#if addedit}
      {#if add}
        <h3 style="text-align: center;">Add MetaBoard</h3>
      {:else}
        <h3 style="text-align: center;">Edit MetaBoard</h3>
      {/if}
    {:else}
      <h3 style="text-align: center;">MetaBoards</h3>
    {/if}
    <div id="metaboards">
      {#if addedit}
        <div id="dialogItems">
          <label>Board Name:</label>
          <input class="dlinput" type="text" bind:value={boardName} />
          <label>Board Description:</label>
          <textarea class="dltextarea" bind:value={boardDesc} />
          <label>Board Description Type:</label>
          <select class="dlselect" bind:value={boardDescType}>
            <option value="text">text</option>
            <option value="md">md</option>
          </select>
          <label>Board Location</label>
          <input class="dlinput" type="text" bind:value={boardLoc} />
        </div>
        <div id="diaglogButtonBar">
          <button
            class="brbutton"
            type="button"
            on:click={() => {
              addedit = false;
              handlekey = true;
            }}>Cancel</button
          >
          <button type="button" class="brbutton" on:click={saveMetaBoard}
            >Save</button
          >
        </div>
      {:else}
        {#each $metaboard.metaboards as board, index}
          {#if $metaboard.cursor === index}
            <a
              class="anchorStyle"
              bind:this={itemDiv}
              on:click={async () => {
                gotoMetaBoard(index);
              }}
              style="background-color: {$metaboard.cursor === index
                ? $Kanban.boards[$boardCursor].styles.cursorColor
                : $Kanban.boards[$boardCursor].styles
                    .dialogBGColor}; color: {$metaboard.cursor === index
                ? $Kanban.boards[$boardCursor].styles.cursorText
                : $Kanban.boards[$boardCursor].styles.dialogTextColor};"
            >
              {board.name}
            </a>
          {:else}
            <a
              class="anchorStyle"
              on:click={async () => {
                gotoMetaBoard(index);
              }}
              style="background-color: {$metaboard.cursor === index
                ? $Kanban.boards[$boardCursor].styles.cursorColor
                : $Kanban.boards[$boardCursor].styles
                    .dialogBGColor}; color: {$metaboard.cursor === index
                ? $Kanban.boards[$boardCursor].styles.cursorText
                : $Kanban.boards[$boardCursor].styles.dialogTextColor};"
            >
              {board.name}
            </a>
          {/if}
        {/each}
      {/if}
    </div>
    {#if !addedit}
      <div id="buttonrow">
        <button
          class="brbutton"
          on:click={() => {
            newMetaBoard();
          }}>Add</button
        >
        <button
          class="brbutton"
          on:click={() => {
            deleteCurrentMetaboard();
          }}>Delete</button
        >
        <button
          class="brbutton"
          on:click={(e) => {
            close(e);
          }}>Cancel</button
        >
      </div>
    {/if}
  </div>
</div>

<style>
  #MBBackground {
    background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    top: 36px;
    left: 0px;
    z-index: 200;
    border: 5px solid transparent;
    border-radius: 10px;
  }

  #metaboardlist {
    display: flex;
    flex-direction: column;
    height: 50%;
    width: 50%;
    margin: auto;
    border-radius: 10px;
  }

  #buttonrow {
    display: flex;
    flex-direction: row;
    padding: 0p;
    margin: 10px auto;
  }

  #diaglogButtonBar {
    display: flex;
    flex-direction: row;
    padding: 0p;
    margin: 10px auto;
  }

  #metaboards {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: scroll;
  }

  #dialogItems {
    display: flex;
    flex-direction: column;
    padding: 10px;
  }

  #dialogItems label {
    margin: 10px 0px 5px 0px;
  }

  .anchorStyle {
    text-decoration: none;
    cursor: pointer;
    margin: 2px 10px 2px 10px;
    padding: 5px;
    border-radius: 5px;
  }

  .dlinput {
    padding: 5px;
    margin: 0px 10px 0px 0px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.6);
  }

  .dltextarea {
    padding: 5px;
    margin: 0px 10px 0px 0px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.6);
  }

  .dlselect {
    padding: 5px;
    margin: 0px 10px 0px 0px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.6);
  }

  .brbutton {
    padding: 5px;
    margin: 0px 10px 0px 0px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.6);
  }
</style>
