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

  let origKeyboardHandler = null;
  let handlekey = true;
  let addedit = false;
  let add = true;
  let boardName = "";
  let boardDesc = "";
  let boardDescType = "text";
  let boardLoc = "";

  onMount(() => {
    //
    // Save the original handler and install our new one.
    //
    if ($keyHandler !== null) {
      console.log("Setting our keyboard handler");
      origKeyboardHandler = $keyHandler;
      $keyHandler = KeyboardHandler;
    }

    return () => {
      if (origKeyboardHandler !== null) {
        $keyHandler = origKeyboardHandler;
      }
    };
  });

  function KeyboardHandler(e) {
    $ctrlKey = e.ctrlKey;
    $shiftKey = e.shiftKey;
    $metaKey = e.metaKey;
    $altKey = e.altKey;
    $key = e.key;
    console.log("Metaboard Keyhandler", handlekey);

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
          editMetaBoard($metaboard.metaboards[$metaboard.cursor]);
          break;

        case "j":
          $metaboard.incCursor();
          break;

        case "k":
          $metaboard.decCursor();
          break;

        case "Enter":
          gotoMetaBoard($metaboard.metaboards[$metaboard.cursor]);
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
    $metaboard = $metaboard;
    if (origKeyboardHandler !== null) {
      $keyHandler = origKeyboardHandler;
    }
    console.log("Close function: ", $metaboard);
  }

  function gotoMetaBoard(board) {}

  function newMetaBoard() {
    addedit = true;
    add = true;
  }

  function editMetaBoard(board) {
    addedit = true;
    add = false;
    let mb = $metaboard.metaboards[$metaboard.cursor];
    boardName = mb.name;
    boardDesc = mb.description;
    boardDescType = mb.type;
    boardLoc = mb.loc;
  }

  async function saveMetaBoard() {
    if (add) {
      $metaboard.addmetaboard(boardName, boardDesc, boardDescType, boardLoc);
      await $metaboard.saveMetaBoards();
      $metaboard = $metaboard;
    } else {
      //
      // This is for editing. Save the Edit.
      //
      let mb = $metaboard.metaboards[$metaboard.cursor];
      mb.name = boardName;
      mb.description = boardDesc;
      mb.type = boardDescType;
      mb.loc = boardLoc;
    }
    addedit = false;
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
      <label>Board Name:</label>
      <input type="text" bind:value={boardName} />
      <label>Board Description:</label>
      <textarea bind:value={boardDesc} />
      <label>Board Description Type:</label>
      <select bind:value={boardDescType}>
        <option name="text" value="text" />
        <option name="md" value="md" />
      </select>
      <label>Board Location</label>
      <input type="text" bind:value={boardLoc} />
      <div id="diaglogButtonBar">
        <button
          type="button"
          on:click={() => {
            addedit = false;
          }}>Cancel</button
        >
        <button type="button" on:click={saveMetaBoard}>Save</button>
      </div>
    {:else}
      <h3 style="text-align: center;">MetaBoards</h3>
      {#each $metaboard.metaboards as board, index}
        <a
          class="anchorStyle"
          on:click={() => {
            gotoMetaBoard(board);
          }}
          style="background-color: {$metaboard.cursor === index
            ? $Kanban.boards[$boardCursor].styles.cursorColor
            : 'default'}; color: {$metaboard.cursor === index
            ? $Kanban.boards[$boardCursor].styles.cursorText
            : 'default'};"
        >
          {board.name}
        </a>
      {/each}
    {/if}
  </div>
</div>

<style>
  #MBBackground {
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    top: 0px;
    left: 0px;
    z-index: 200;
  }

  #metaboardlist {
    display: flex;
    flex-direction: column;
    height: 50%;
    width: 50%;
    margin: auto;
    border-radius: 10px;
  }

  .anchorStyle {
    text-decoration: none;
    cursor: pointer;
    margin: 2px 10px 2px 10px;
    padding: 5px;
    border-radius: 5px;
  }
</style>
