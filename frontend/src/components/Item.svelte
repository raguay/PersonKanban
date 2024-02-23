<script>
  import { afterUpdate, createEventDispatcher } from "svelte";
  import ItemEdit from "./ItemEdit.svelte";
  import { itemCursor } from "../stores/itemCursor.js";

  export let itemInfo;
  export let index;
  export let editItem = false;

  const disbatch = createEventDispatcher();
  let itemDiv = null;
  let styles = {
    itembgcolor: "white",
    itemtextcolor: "black",
  };

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

    //
    // Make sure the styles are updated.
    //
    styles = itemInfo.styles;
  });

  function editItemCommand() {
    editItem = true;
  }

  function deleteItem() {
    disbatch("deleteItem", {
      item: itemInfo.id,
    });
  }

  function saveItem(e) {
    if (e.detail.exit) {
      editItem = false;
    }
    disbatch("saveItem", {
      item: itemInfo,
    });
  }

  function newItemMsg(e) {
    disbatch("newItemMsg", e.detail);
  }

  function newItemApp(e) {
    disbatch("newItemApp", e.detail);
  }

  function appUpdate(e) {
    disbatch("appUpdate", e.detail);
  }
</script>

<div
  class="item"
  style="background-color: {styles.itembgcolor}; color: {styles.itemtextcolor}; border-width: {$itemCursor ===
  index
    ? styles.cursorWidth
    : '5px'}; border-color: {$itemCursor === index
    ? styles.cursorColor
    : styles.itembgcolor};"
  on:dblclick={editItemCommand}
  bind:this={itemDiv}
>
  <h2>{itemInfo.name}</h2>
  <p>{itemInfo.description}</p>
  {#if editItem}
    <ItemEdit
      {itemInfo}
      {styles}
      on:deleteItem={deleteItem}
      on:newItemMsg={newItemMsg}
      on:newItemApp={newItemApp}
      on:appUpdate={appUpdate}
      on:saveItem={saveItem}
      on:editOff={() => {
        disbatch("editOff", {});
      }}
    />
  {/if}
</div>

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
