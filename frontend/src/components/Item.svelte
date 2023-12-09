<script>
  import { createEventDispatcher } from "svelte";
  import ItemEdit from "./ItemEdit.svelte";
  import { itemCursor } from "../stores/itemCursor.js";

  export let styles;
  export let itemInfo;
  export let index;

  let edit = false;

  const disbatch = createEventDispatcher();

  function editItem() {
    edit = true;
  }

  function deleteItem() {
    disbatch("deleteItem", {
      item: itemInfo.id,
    });
  }

  function saveItem(e) {
    if (e.detail.exit) {
      edit = false;
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
  on:dblclick={editItem}
>
  <h2>{itemInfo.name}</h2>
  <p>{itemInfo.description}</p>
  {#if edit}
    <ItemEdit
      {itemInfo}
      {styles}
      on:deleteItem={deleteItem}
      on:newItemMsg={newItemMsg}
      on:newItemApp={newItemApp}
      on:appUpdate={appUpdate}
      on:saveItem={saveItem}
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
