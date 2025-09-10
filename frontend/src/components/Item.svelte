<script>
  import ItemEdit from "./ItemEdit.svelte";
  import { itemCursor } from "../stores/itemCursor.js";
  import { listCursor } from "../stores/listCursor.js";
  import { editItem } from "../stores/editItem.js";

  let { itemInfo = $bindable(), itemindex, listindex, editoff } = $props();

  let itemDiv = $state(null);

  $effect.pre(() => {
    //
    // Make sure the cursor is fully visible by scrolling.
    //
    if (
      $itemCursor === itemindex &&
      $listCursor === listindex &&
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
    $itemCursor = itemindex;
    $listCursor = listindex;
    $editItem = true;
  }
</script>

{#if itemInfo !== null}
  <div
    class="item"
    style="background-color: {itemInfo.styles.itembgcolor}; color: {itemInfo
      .styles.itemtextcolor}; border-width: {$itemCursor === itemindex
      ? itemInfo.styles.cursorWidth
      : '5px'}; border-color: {$itemCursor === itemindex
      ? itemInfo.styles.cursorColor
      : itemInfo.styles.itembgcolor};"
    ondblclick={editItemCommand}
    bind:this={itemDiv}
    onclick={() => {
      $itemCursor = itemindex;
      $listCursor = listindex;
    }}
  >
    <h2>{itemInfo.name}</h2>
    <p>{itemInfo.description}</p>
    {#if $itemCursor === itemindex && $listCursor === listindex && $editItem}
      <ItemEdit
        {itemInfo}
        closeEdit={() => {
          editoff();
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
