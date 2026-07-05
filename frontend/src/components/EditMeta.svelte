<script>
  import { onMount } from "svelte";
  import { Kanban } from "../stores/Kanban.js";
  import { boardCursor } from "../stores/boardCursor.js";
  import { kbstate } from "../stores/kbstate.js";

  let { close } = $props();
  let TextDescription = $state(null);
  let origstate = 0;
  let orgDes = "";

  onMount(() => {
    origstate = $kbstate;
    orgDes = $Kanban.boards[$boardCursor].description;
    $kbstate = 2;
  });

  $effect(() => {
    TextDescription.focus();
  });
</script>

<div id="EditMetaDiv">
  <div
    id="EditMetaDivDiag"
    style="background-color: {$Kanban.boards[$boardCursor].styles
      .commandbarbgcolor};
         color: {$Kanban.boards[$boardCursor].styles.commandbartextcolor};
         font-family: {$Kanban.boards[$boardCursor].styles.font};
         font-size: {$Kanban.boards[$boardCursor].styles.fontsize}px;"
  >
    <h1>Edit Board Meta Data</h1>
    <textarea bind:this={TextDescription} resize="false" rows="5" cols="100"
      >{$Kanban.boards[$boardCursor].description.trim()}</textarea
    >
    <div id="buttondiv">
      <button
        onclick={async () => {
          $Kanban.boards[$boardCursor].description =
            TextDescription.value.trim();
          $kbstate = origstate;
          await $Kanban.SaveKanbanBoards();
          close();
        }}
        >Save
      </button>
      <button
        onclick={async () => {
          $Kanban.boards[$boardCursor].description = orgDes;
          $kbstate = origstate;
          await $Kanban.SaveKanbanBoards();
          close();
        }}
      >
        Close
      </button>
    </div>
  </div>
</div>

<style>
  #EditMetaDiv {
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 200;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  #EditMetaDivDiag {
    margin: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    margin: auto;
    z-index: 200;
    border-radius: 10px;
  }

  #buttondiv {
    display: flex;
    flex-direction: row;
    margin: auto;
  }

  #buttondiv button {
    margin: auto 10px;
    padding: 5px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.6);
  }

  #EditMetaDiv textarea {
    margin: 10px auto;
    padding: 0px;
    resize: none;
  }
</style>
