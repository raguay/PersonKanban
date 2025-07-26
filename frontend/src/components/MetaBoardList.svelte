<script>
  import { onMount } from "svelte";
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

  let origKeyboardHandler = $state(null);
  let handlekey = $state(true);
  let addedit = $state(false);
  let add = $state(true);
  let boardName = $state("");
  let boardDesc = $state("");
  let boardDescType = $state("text");
  let boardLoc = $state("");
  let itemDiv = $state(null);

  onMount(() => {
    //
    // Save the original handler and install our new one.
    //
    if ($keyHandler !== null && $keyHandler != KeyboardHandler) {
      origKeyboardHandler = $keyHandler;
      $keyHandler = KeyboardHandler;
    }

    return () => {
      //
      // Restore the original keyboard handler.
      //
      if (origKeyboardHandler !== null) {
        $keyHandler = origKeyboardHandler;
        origKeyboardHandler = null;
      }
    };
  });

  $effect(() => {
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
      e.stopPropagation();

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
          if (!addedit) {
            await gotoMetaBoard($metaboard.cursor);
            close();
          }
          break;

        case "Escape":
          if (addedit) {
            addedit = false;
          } else {
            close();
          }
          break;

        default:
          break;
      }
    }
  }

  function close() {
    $metaboard.clearShowing();
    addedit = false;
    $metaboard = $metaboard;
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
    } else {
      //
      // The file hasn't been created yet. Create it and set it.
      //
      $Kanban.boards = [];
      let cmd = $commandBar.getCommand("Add a New Board");
      await cmd.command();
    }
    $metaboard.clearShowing();
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
      console.log("saveMetaBoard: ", boardName);
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
    add = false;
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
            onclick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addedit = false;
              handlekey = true;
            }}
            onkeyup={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.key === "Enter") {
                addedit = false;
                handlekey = true;
              }
            }}>Cancel</button
          >
          <button
            type="button"
            class="brbutton"
            onclick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              saveMetaBoard();
            }}
            onkeyup={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.key === "Enter") saveMetaBoard();
            }}
          >
            Add
          </button>
        </div>
      {:else}
        {#each $metaboard.metaboards as board, index}
          {#if $metaboard.cursor === index}
            <a
              class="anchorStyle"
              bind:this={itemDiv}
              onclick={async () => {
                await gotoMetaBoard(index);
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
              onclick={async () => {
                await gotoMetaBoard(index);
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
          onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            newMetaBoard();
          }}
          onkeyup={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.key === "Enter") newMetaBoard();
          }}>Add</button
        >
        <button
          class="brbutton"
          onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteCurrentMetaboard();
          }}
          onkeyup={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.key === "Enter") deleteCurrentMetaboard();
          }}>Delete</button
        >
        <button
          class="brbutton"
          onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            close();
          }}
          onkeyup={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.key === "Enter") close();
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
