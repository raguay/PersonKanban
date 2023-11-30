<script>
  import { createEventDispatcher, tick, onMount, beforeUpdate } from "svelte";
  import { dndzone } from "svelte-dnd-action";
  import EditH2Field from "./EditH2Field.svelte";
  import Item from "./Item.svelte";
  import { Kanban } from "../stores/Kanban.js";

  export let board;
  export let id;
  export let styles;

  let items = null;
  let listData = null;

  const disbatch = createEventDispatcher();

  onMount(() => {
    SetItems();
  });

  beforeUpdate(() => {
    SetItems();
  });

  function SetItems() {
    //
    // Make sure the id is valid. Set to zero if not.
    //
    if (id === null) id = 0;

    //
    // Get the updated list information.
    //
    listData = $Kanban.boards
      .filter((item) => item.id === board)[0]
      .lists.filter((item) => item.id === id)[0];

    //
    // Set the items list.
    //
    items = listData.items;
  }

  async function addItem() {
    //
    // Get the upper routines set a new list item.
    //
    disbatch("addItem", {
      list: id,
    });
  }

  async function deleteList() {
    //
    // Tell the powers above to remove this list.
    //
    disbatch("deleteList", {
      list: id,
    });
  }

  function deleteItem(e) {
    //
    // Tell the powers above to remove a list item.
    //
    disbatch("deleteItem", {
      item: e.detail.item,
      list: id,
    });
  }

  function nameChanged(e) {
    //
    // Update the list data.
    //
    listData = $Kanban.boards
      .filter((item) => item.id === board)[0]
      .lists.filter((item) => item.id === id)[0];

    //
    // Set the new name.
    //
    listData.name = e.detail.name;

    //
    // Tell the powers above.
    //
    disbatch("listUpdate", {
      list: listData,
    });
  }

  function newItemMsg(e) {
    //
    // Ask the powers above to create a new item.
    //
    disbatch("newItemMsg", {
      list: id,
      item: e.detail.item,
      msg: e.detail.msg,
    });
  }

  function newItemApp(e) {
    //
    // Tell the powers above to create a new item app.
    //
    disbatch("newItemApp", {
      list: id,
      item: e.detail.item,
      app: e.detail.app,
    });
  }

  function appUpdate(e) {
    //
    // Update the application item.
    //
    disbatch("appUpdate", {
      list: id,
      item: e.detail.item,
      app: e.detail.app,
    });
  }

  function handleSort(e) {
    //
    // TODO: Need to fix id and remove the drag and drop field.
    //
    listData = $Kanban.boards
      .filter((item) => item.id === board)[0]
      .lists.filter((item) => item.id === id)[0];
    listData.items = e.detail.items.map((item, key) => {
      item.id = key;
    });
    disbatch("listUpdate", {
      list: listData,
    });
  }

  function saveItem(e) {
    //
    // Get the current list data.
    //
    listData = $Kanban.boards
      .filter((item) => item.id === board)[0]
      .lists.filter((item) => item.id === id)[0];

    //
    // Update the particular item data.
    //
    listData.items = listData.items.map((item) => {
      if (item.id === e.detail.id) {
        item = e.detail;
      }
      return item;
    });

    //
    // Send it upstream.
    //
    disbatch("listUpdate", {
      list: listData,
    });
  }
</script>

<div
  class="list"
  style="background-color: {styles.listbgcolor}; color: {styles.listtextcolor};"
>
  {#if listData !== null}
    <div class="listheader">
      <EditH2Field name={listData.name} {styles} on:nameChanged={nameChanged} />
      <span
        class="remove"
        on:click={() => {
          deleteList();
        }}>-</span
      >
      <span
        class="add"
        on:click={() => {
          addItem();
        }}>+</span
      >
    </div>
    <div
      class="itemcontainer"
      use:dndzone={{ items }}
      on:consider={handleSort}
      on:finalize={handleSort}
    >
      {#if items.length !== 0}
        {#each items as item}
          {#if item !== null}
            <Item
              itemInfo={item}
              {styles}
              on:deleteItem={deleteItem}
              on:newItemMsg={newItemMsg}
              on:newItemApp={newItemApp}
              on:appUpdate={appUpdate}
              on:saveItem={saveItem}
            />
          {/if}
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;
    margin: 10px;
    width: 250px;
    min-width: 250px;
    padding: 0px 0px 5px 0px;
    border: 5px solid transparent;
    border-radius: 5px;
    max-height: -webkit-fill-available;
    height: 96%;
  }

  .listheader {
    display: flex;
    flex-direction: row;
    margin: 5px;
    align-content: center;
  }

  .listheader .remove {
    margin: 5px 5px 5px auto;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    cursor: pointer;
    height: 20px;
    align-self: center;
  }

  .listheader .add {
    margin: 5px 5px 5px 5px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    cursor: pointer;
    height: 20px;
    align-self: center;
  }

  .itemcontainer {
    min-height: 100px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .itemcontainer::-webkit-scrollbar {
    width: 6px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 6px;
  }

  .itemcontainer::-webkit-scrollbar-thumb {
    background-color: rgba(10, 10, 10, 0.5);
    border-radius: 6px;
  }
</style>
