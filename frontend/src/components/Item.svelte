<script>
  import { afterUpdate, createEventDispatcher} from "svelte";
  import ItemEdit from "./ItemEdit.svelte";
  import { itemCursor } from "../stores/itemCursor.js";

  export let itemInfo = null;
  export let index = 0;
  export let editItem = false;

  const disbatch = createEventDispatcher();

  let itemDiv = null;

  afterUpdate(() => {
    //
    // Make sure the cursor is fully visible by scrolling.
    //
    if (
      $itemCursor === index &&
      typeof itemDiv !== "undefined" &&
      itemDiv !== null
    ) {
      //
      // There is a selected. Make sure it's in view.
      //
      itemDiv.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  });

  function editItemCommand() {
    editItem = true;
  }
</script>

{#if itemInfo !== null}
<div
  class="item"
  style="background-color: {itemInfo.styles.itembgcolor}; color: {itemInfo.styles.itemtextcolor}; border-width: {$itemCursor ===
  index
    ? itemInfo.styles.cursorWidth
    : '5px'}; border-color: {$itemCursor === index
    ? itemInfo.styles.cursorColor
    : itemInfo.styles.itembgcolor};"
  on:dblclick={editItemCommand}
  bind:this={itemDiv}
>
  <h2>{itemInfo.name}</h2>
  <p>{itemInfo.description}</p>
  {#if editItem}
    <ItemEdit
      {itemInfo}
      on:editOff={() => {
        disbatch("editOff", {});
      }}
    />
  {/if}
</div>
{/if}

<style>
  .item {
    margin: 5px 5px 10px 5px;
    padding: 10px;
    align-content: center;
    border: 5px solid transparent;
    border-radius: 5px;
    text-align: left;
  }
</style>
