<script>
  import ItemEdit from "./ItemEdit.svelte";
  import { itemCursor } from "../stores/itemCursor.js";
  import { listCursor } from "../stores/listCursor.js";
  import { editItem } from "../stores/editItem.js";

  let { items, itemindex, listindex, editoff, saveboard } = $props();

  let itemDiv = $state(null);

  $effect.pre(async () => {
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

{#if items[itemindex] !== null}
  <div
    class="item"
    style="background-color: {items[itemindex].styles
      .itembgcolor}; color: {items[itemindex].styles
      .itemtextcolor}; border-width: {$itemCursor === itemindex &&
    $listCursor === listindex
      ? items[itemindex].styles.cursorWidth
      : '5px'}; border-color: {$itemCursor === itemindex &&
    $listCursor === listindex
      ? items[itemindex].styles.cursorColor
      : items[itemindex].styles.itembgcolor};"
    ondblclick={editItemCommand}
    bind:this={itemDiv}
    onclick={() => {
      $itemCursor = itemindex;
      $listCursor = listindex;
    }}
  >
    <h2>{items[itemindex].name}</h2>
    <p>{items[itemindex].description}</p>
    {#if $itemCursor === itemindex && $listCursor === listindex && $editItem && items[itemindex] !== null}
      <ItemEdit
        itemInfo={items[itemindex]}
        closeEdit={() => {
          editoff();
        }}
        {saveboard}
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
