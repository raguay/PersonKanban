<script>
  import { onMount } from "svelte";
  import VimInput from "./VimInput.svelte";
  import { keyHandler } from "../stores/keyHandler.js";
  import { boardCursor } from "../stores/boardCursor.js";
  import { listCursor } from "../stores/listCursor.js";
  import { itemCursor } from "../stores/itemCursor.js";
  import { Kanban } from "../stores/Kanban.js";

  let { show = $bindable() } = $props();

  let value = $state("");
  let focus = $state(() => {});
  let oldKeyHandler = null;
  let theme = {
    modes: [
      {
        name: "normal",
        color: "blue",
        text: "white",
      },
      {
        name: "insert",
        color: "yellow",
        text: "black",
      },
      {
        name: "visual",
        color: "green",
        text: "purple",
      },
    ],
  };

  onMount(() => {
    //
    // Focus the input first.
    //
    focus();

    //
    // Store the key handler.
    //
    oldKeyHandler = $keyHandler;
    $keyHandler = null;

    return () => {
      //
      // If the oldKeyHanger isn't null, set it back to the $keyHandler.
      //
      if (oldKeyHandler !== null) {
        $keyHandler = oldKeyHandler;
        oldKeyHandler = null;
      }
    };
  });

  $effect(() => {
    focus();
  });
</script>

<div
  id="QuickBarDiv"
  style="background-color: {$Kanban.boards[$boardCursor].styles
    .commandbarbgcolor};
         color: {$Kanban.boards[$boardCursor].styles.commandbartextcolor};
         font-family: {$Kanban.boards[$boardCursor].styles.font};
         font-size: {$Kanban.boards[$boardCursor].styles.fontsize};"
>
  <VimInput
    {value}
    {theme}
    bind:focus
    short={false}
    bind:show
    style="background-color: {$Kanban.boards[$boardCursor].styles
      .commandbarbgcolor};
         color: {$Kanban.boards[$boardCursor].styles.commandbartextcolor};
         font-family: {$Kanban.boards[$boardCursor].styles.font};
         font-size: {$Kanban.boards[$boardCursor].styles.fontsize};"
    oneline={true}
    oninput={async (inputVal) => {
      inputVal = inputVal.trim();
      if (inputVal !== "") {
        //
        // Split the input to a name and description. There will not always be a description.
        //
        let parts = inputVal.split("|");
        let newName = parts[0];
        let newDes = "";
        if (parts.length > 1) {
          newDes = parts[1];
        }

        if ($listCursor < 0 && $itemCursor < 0) {
          await $Kanban.addBoardNamed(newName, newDes);
        } else if ($listCursor >= 0) {
          if ($itemCursor >= 0) {
            //
            // Add an item.
            //
            await $Kanban.addItemNamed(newName, newDes);
          } else {
            //
            // Add a list.
            //
            await $Kanban.addListNamed(newName);
          }
        }
      }
      //
      // Close the quickBar.
      //
      show = false;
    }}
  />
</div>

<style>
  #QuickBarDiv {
    position: absolute;
    bottom: 40px;
    left: 10%;
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: auto;
    padding: 10px;
    border: 5px;
    border-radius: 10px;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.5);
    z-index: 200;
  }
</style>
