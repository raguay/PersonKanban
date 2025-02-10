<!-- @migration-task Error while migrating Svelte code: can't migrate `let state = 0;` to `$state` because there's a variable named state.
     Rename the variable and try again or migrate by hand. -->
<script>
  import { onMount, tick } from "svelte";
  import BoardPref from "./BoardPref.svelte";
  import ListPref from "./ListPref.svelte";
  import ItemPref from "./ItemPref.svelte";
  import { keyHandler } from "../stores/keyHandler.js";
  import { boardCursor } from "../stores/boardCursor.js";
  import { listCursor } from "../stores/listCursor.js";
  import { itemCursor } from "../stores/itemCursor.js";
  import { preferences } from "../stores/preferences.js";
  import { Kanban } from "../stores/Kanban.js";

  let state = 0;
  let original = null;
  let prefs = null;

  onMount(async () => {
    //
    // Clear the keyboardHandler.
    //
    $keyHandler = null;

    //
    // Figure the state for displaying preferences.
    //
    // State      Meaning
    // 0          Edit board preferences
    // 1          Edit list preferences
    // 2          Edit item preferences
    //
    if ($itemCursor >= 0) {
      state = 2;
      original =
        $Kanban.boards[$boardCursor].lists[$listCursor].items[$itemCursor]
          .styles;
    } else if ($listCursor >= 0) {
      state = 1;
      original = $Kanban.boards[$boardCursor].lists[$listCursor].styles;
    } else {
      state = 0;
      original = $Kanban.boards[$boardCursor].styles;
    }

    //
    // Make a copy for the preferences to use in the dialog.
    //
    prefs = { ...original };
    return () => {
      //
      // Restore the keyboardHandler.
      //
      $keyHandler = $preferences.keyboardHandler;
    };
  });

  async function revertChanges() {
    //
    // Undo the changes made.
    //
    if ($itemCursor >= 0) {
      $Kanban.boards[$boardCursor].lists[$listCursor].items[
        $itemCursor
      ].styles = original;
    } else if ($listCursor >= 0) {
      $Kanban.boards[$boardCursor].lists[$listCursor].styles = original;
    } else if ($boardCursor >= 0) {
      $Kanban.boards[$boardCursor].styles = original;
    }
    $Kanban = $Kanban;
    await $Kanban.SaveKanbanBoards();
  }

  async function savePreference() {
    if ($itemCursor >= 0) {
      $Kanban.boards[$boardCursor].lists[$listCursor].items[
        $itemCursor
      ].styles = prefs;
    } else if ($listCursor >= 0) {
      $Kanban.boards[$boardCursor].lists[$listCursor].styles = prefs;
    } else if ($boardCursor >= 0) {
      $Kanban.boards[$boardCursor].styles = prefs;
    }
    $Kanban = $Kanban;
    await $Kanban.SaveKanbanBoards();
  }

  async function Quit() {
    $keyHandler = $preferences.keyboardHandler;
    $preferences.showing = false;
    $preferences = $preferences;
  }

  async function onchange(e) {
    prefs = e.detail;
    await savePreference();
  }
</script>

<div
  id="PrefMainDiv"
  style="background-color: {$Kanban.boards[$boardCursor].styles
    .commandbarbgcolor};
         color: {$Kanban.boards[$boardCursor].styles.commandbartextcolor};
         font-family: {$Kanban.boards[$boardCursor].styles.font};
         font-size: {$Kanban.boards[$boardCursor].styles.fontsize}px;"
>
  {#if prefs !== null}
    {#if state === 0}
      <BoardPref {prefs} on:change={onchange} />
    {:else if state === 1}
      <ListPref {prefs} on:change={onchange} />
    {:else if state === 2}
      <ItemPref {prefs} on:change={onchange} />
    {/if}
  {/if}
  <div id="buttonbar">
    <div id="buttons">
      <button
        on:click={async () => {
          await savePreference();
          await Quit();
        }}
      >
        Save
      </button>
      <button
        on:click={async () => {
          await revertChanges();
          await Quit();
        }}
      >
        Close
      </button>
    </div>
  </div>
</div>

<style>
  #PrefMainDiv {
    position: absolute;
    bottom: 5%;
    left: 10%;
    display: flex;
    flex-direction: column;
    width: 80%;
    height: 86%;
    margin: auto;
    padding: 10px;
    border: 5px;
    border-radius: 10px;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.5);
    z-index: 200;
  }

  #buttonbar {
    display: flex;
    flex-direction: row;
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 50px;
    margin: auto;
  }

  #buttonbar button {
    height: 30px;
    margin: 0px 10px;
    border-radius: 10px;
  }

  #buttons {
    display: flex;
    flex-direction: row;
    margin: 0px auto;
  }
</style>
