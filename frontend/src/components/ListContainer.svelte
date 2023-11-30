<script>
  import { createEventDispatcher, onMount, beforeUpdate } from "svelte";
  import List from "./List.svelte";
  import { Kanban } from "../stores/Kanban.js";

  export let board;
  export let styles;

  let boardData;
  const dispatch = createEventDispatcher();

  onMount(() => {
    boardData = $Kanban.boards.filter((item) => item.id === board)[0];
  });

  beforeUpdate(() => {
    boardData = $Kanban.boards.filter((item) => item.id === board)[0];
  });
</script>

<div id="ListsContainer" style="background-color: {styles.listcontainercolor};">
  {#if boardData.lists.length > 0}
    {#each boardData.lists as item}
      <List
        {styles}
        {board}
        id={item.id}
        on:deleteList={(e) => {
          dispatch("deleteList", e.detail);
        }}
        on:addItem={(e) => {
          dispatch("additem", e.detail);
        }}
        on:deleteItem={(e) => {
          dispatch("deleteItem", e.detail);
        }}
        on:newItemMsg={(e) => {
          dispatch("newItemMsg", e.detail);
        }}
        on:newItemApp={(e) => {
          dispatch("newItemApp", e.detail);
        }}
        on:appUpdate={(e) => {
          dispatch("appUpdate", e.detail);
        }}
        on:listUpdate={(e) => {
          dispatch("listUpdate", e.detail);
        }}
      />
    {/each}
  {/if}
  <div
    id="addList"
    on:click={() => {
      dispatch("addlist", {
        board: board,
      });
    }}
  >
    <p>+ New List</p>
  </div>
</div>

<style>
  #addList {
    padding: 30px;
    width: 100px;
    max-width: 100px;
    min-width: 100px;
    background-color: rgba(255, 255, 255, 0.3);
    margin: auto 20px auto 20px;
    cursor: pointer;
    text-decoration: none;
    user-select: none;
    border-radius: 10px;
    border: 5px solid transparent;
    text-align: center;
  }

  #ListsContainer {
    display: flex;
    flex-direction: row;
    flex: 1;
    margin: 0px;
    overflow-x: auto;
    overflow-y: hidden;
    border: 3px solid transparent;
    border-radius: 0px 10px 10px 10px;
  }

  #ListsContainer::-webkit-scrollbar {
    height: 6px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 6px;
  }

  #ListsContainer::-webkit-scrollbar-thumb {
    height: 6px;
    background-color: rgba(10, 10, 10, 0.5);
    border-radius: 6px;
  }
</style>
