<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { keyHandler } from "../stores/keyHandler.js";
  import { boardCursor } from "../stores/boardCursor.js";
  import { listCursor } from "../stores/listCursor.js";
  import { itemCursor } from "../stores/itemCursor.js";
  import { Kanban } from "../stores/Kanban.js";

  const disbatch = createEventDispatcher();

  let inputDiv = $state(null);
  let inputVal = $state("");
  let oldKeyHandler = null;
  let handlekey = true;

  onMount(() => {
    //
    // Focus the input first.
    //
    inputDiv.focus();

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
</script>

<div
  id="QuickBarDiv"
  style="background-color: {$Kanban.boards[$boardCursor].styles.commandbarbgcolor};
         color: {$Kanban.boards[$boardCursor].styles.commandbartextcolor};
         font-family: {$Kanban.boards[$boardCursor].styles.font};
         font-size: {$Kanban.boards[$boardCursor].styles.fontsize}px;"
>
  <input
    id="quickBarInput"
    type="text"
    bind:this={inputDiv}
    bind:value={inputVal}
    onkeydown={async (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        //
        // Close the quickBar.
        //
        disbatch("close",{});
      } else if (e.key === "Enter") {
        //
        // Add the contents of the input to the current focused item.
        //
        e.preventDefault();

        inputVal = inputVal.trim();
        if(inputVal !== "") {
          // 
          // Split the input to a name and description. There will not always be a description.
          // 
          let parts = inputVal.split("|");
          let newName = parts[0];
          let newDes = "";
          if(parts.length > 1) {
            newDes = parts[1];
          }

          if($listCursor < 0 && $itemCursor < 0){
            await $Kanban.addBoardNamed(newName,newDes);
          } else if($listCursor >= 0) {
            if($itemCursor >= 0) {
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
          $Kanban = $Kanban;
        }
        //
        // Close the quickBar.
        //
        disbatch("close",{});
      }
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
    height: 55px;
    margin: auto;
    padding: 10px;
    border: 5px;
    border-radius: 10px;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.5);
    z-index: 200;
  }

  #quickBarInput {
    background-color: rgba(255, 255, 255, 0.3);
    margin: 10px;
    padding: 10px;
    border-radius: 10px;
  }
</style>
