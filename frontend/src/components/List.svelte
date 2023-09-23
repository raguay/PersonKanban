<script>
  import { createEventDispatcher, tick, onMount, beforeUpdate } from "svelte";
  //  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import EditH2Field from "./EditH2Field.svelte";
  import Item from "./Item.svelte";
  import { Kanban } from "../stores/Kanban.js";

  export let board;
  export let id;
  export let styles;

  let items;

  const disbatch = createEventDispatcher();

  onMount(() => {
    items = $Kanban.boards[board].lists[id].items;
  });

  beforeUpdate(() => {
    items = $Kanban.boards[board].lists[id].items;
  });

  async function addItem() {
    disbatch("addItem", {
      list: $Kanban.boards[board].lists[id].id,
    });
  }

  async function deleteList() {
    disbatch("deleteList", {
      list: $Kanban.boards[board].lists[id].id,
    });
  }

  function deleteItem(e) {
    disbatch("deleteItem", {
      item: e.detail.item,
      list: $Kanban.boards[board].lists[id].id,
    });
  }

  function nameChanged(e) {
    $Kanban.boards[board].lists[id].name = e.detail.name;
    disbatch("listUpdate", {
      list: $Kanban.boards[board].lists[id],
    });
  }

  function newItemMsg(e) {
    disbatch("newItemMsg", {
      list: $Kanban.boards[board].lists[id].id,
      item: e.detail.item,
      msg: e.detail.msg,
    });
  }

  function newItemApp(e) {
    disbatch("newItemApp", {
      list: $Kanban.boards[board].lists[id].id,
      item: e.detail.item,
      app: e.detail.app,
    });
  }

  function appUpdate(e) {
    disbatch("appUpdate", {
      list: $Kanban.boards[board].lists[id].id,
      item: e.detail.item,
      app: e.detail.app,
    });
  }

  function handleSort(e) {
    $Kanban.boards[board].lists[id].items = e.detail.items;
    $Kanban.boards[board].lists[id] = $Kanban.boards[board].lists[id];
    disbatch("listUpdate", {
      list: $Kanban.boards[board].lists[id],
    });
  }

  function saveItem(e) {
    $Kanban.boards[board].lists[id].items[e.detail.item.id] = e.detail.item;
    disbatch("listUpdate", {
      list: $Kanban.boards[board].lists[id],
    });
  }
</script>

<div
  class="list"
  style="background-color: {styles.listbgcolor}; color: {styles.listtextcolor};"
>
  <div class="listheader">
    <EditH2Field
      name={$Kanban.boards[board].lists[id].name}
      {styles}
      on:nameChanged={nameChanged}
    />
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
    {#each items as item (item.id)}
      <Item
        itemInfo={item}
        {styles}
        on:deleteItem={deleteItem}
        on:newItemMsg={newItemMsg}
        on:newItemApp={newItemApp}
        on:appUpdate={appUpdate}
        on:saveItem={saveItem}
      />
    {/each}
  </div>
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
  }

  .listheader .remove {
    margin: 5px 5px 5px auto;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    cursor: pointer;
  }

  .listheader .add {
    margin: 5px 5px 5px 5px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    cursor: pointer;
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
