<script>
  import { createEventDispatcher, onMount, beforeUpdate } from "svelte";
  import List from "./List.svelte";
  import { Kanban } from "../stores/Kanban.js";
  import { ctrlKey } from "../stores/ctrlKey.js";
  import { shiftKey } from "../stores/shiftKey.js";
  import { metaKey } from "../stores/metaKey.js";
  import { altKey } from "../stores/altKey.js";
  import { key } from "../stores/key.js";
  import { skipKey } from "../stores/skipKey.js";
  import { listCursor } from "../stores/listCursor.js";
  import { itemCursor } from "../stores/itemCursor.js";
  import { keyHandler } from "../stores/keyHandler.js";

  export let board;
  export let styles;

  let boardData;
  const dispatch = createEventDispatcher();

  onMount(() => {
    boardData = $Kanban.boards.filter((item) => item.id === board)[0];
    $keyHandler = listKeyHandler;
  });

  beforeUpdate(() => {
    boardData = $Kanban.boards.filter((item) => item.id === board)[0];
  });

  function listKeyHandler(e) {
    console.log("keyhandler: ", e);
    $ctrlKey = e.ctrlKey;
    $shiftKey = e.shiftKey;
    $metaKey = e.metaKey;
    $altKey = e.altKey;
    $key = e.key;
    if (!$skipKey) {
      e.preventDefault();
      processKey();
    }
    $skipKey = false;
  }

  function processKey() {
    //
    // This is just normal key processing. Run the command for that key.
    //
    switch ($key) {
      case "h":
        //
        // Move to the list to the left if any.
        //
        $listCursor = $listCursor - 1;
        if ($listCursor < 0) $listCursor = 0;
        $itemCursor = 0;
        break;

      case "k":
        //
        // Move to the list item down one if any.
        //
        $itemCursor = $itemCursor - 1;
        if ($itemCursor < 0) $itemCursor = 0;
        break;

      case "j":
        //
        // Move to the list item up one if any.
        //
        let items = $Kanban.boards[board].lists[$listCursor].items;
        if (items.length !== 0) {
          $itemCursor = $itemCursor + 1;
          if ($itemCursor >= items.length) $itemCursor = items.length - 1;
        }
        break;

      case "l":
        //
        // Move to the list to the right if any.
        //
        $listCursor = $listCursor + 1;
        if ($listCursor >= $Kanban.boards[board].lists.length)
          $listCursor = $Kanban.boards[board].lists.length - 1;
        $itemCursor = 0;
        break;
    }
  }
</script>

<div id="ListsContainer" style="background-color: {styles.listcontainercolor};">
  {#if boardData.lists.length > 0}
    {#each boardData.lists as item, index}
      <List
        {styles}
        {board}
        {index}
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
