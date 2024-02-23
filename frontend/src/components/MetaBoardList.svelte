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
  let cursor = 0;

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
        case "e":
          //
          // Edit the metaboard information.
          //
          break;

        case "Enter":
          close(e);
          break;

        case "Escape":
          close(e);
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
</script>

<div id="MBBackground">
  <div
    id="metaboardlist"
    style="background-color: {$Kanban.boards[$boardCursor].styles
      .dialogBGColor}; color: {$Kanban.boards[$boardCursor].styles
      .dialogTextColor};"
  >
    <h3 style="text-align: center;">MetaBoards</h3>
    {#each $metaboard.metaboards as board, index}
      {#if index === cursor}
        <p
          style="background-color: {$Kanban.boards[$boardCursor].styles
            .cursorColor};"
        >
          {board.name}
        </p>
      {:else}
        <p>{board.name}</p>
      {/if}
    {/each}
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
  }
</style>
