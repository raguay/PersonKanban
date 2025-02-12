<script>
  import ItemEdit from "./ItemEdit.svelte";
  import { itemCursor } from "../stores/itemCursor.js";

  let { itemInfo = $bindable(), index, editItem, editoff } = $props();

  let itemDiv = $state(null);
  let localedit = $state(false);

  $effect.pre(() => {
    //
    // Make sure the cursor is fully visible by scrolling.
    //
    localedit = index === $itemCursor ? editItem : false;
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
    localedit = true;
    $itemCursor = index;
  }
</script>

{#if itemInfo !== null}
  <div
    class="item"
    style="background-color: {itemInfo.styles.itembgcolor}; color: {itemInfo
      .styles.itemtextcolor}; border-width: {$itemCursor === index
      ? itemInfo.styles.cursorWidth
      : '5px'}; border-color: {$itemCursor === index
      ? itemInfo.styles.cursorColor
      : itemInfo.styles.itembgcolor};"
    ondblclick={editItemCommand}
    bind:this={itemDiv}
    onclick={() => {
      $itemCursor = index;
    }}
  >
    <h2>{itemInfo.name}</h2>
    <p>{itemInfo.description}</p>
    {#if localedit}
      <ItemEdit
        {itemInfo}
        editoff={() => {
          editItem = false;
          localedit = false;
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
