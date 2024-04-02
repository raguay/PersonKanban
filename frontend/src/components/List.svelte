<script>
  import {
    afterUpdate,
    createEventDispatcher,
  } from "svelte";
  import EditH2Field from "./EditH2Field.svelte";
  import Item from "./Item.svelte";
  import { Kanban } from "../stores/Kanban.js";
  import { boardCursor } from "../stores/boardCursor.js";
  import { listCursor } from "../stores/listCursor.js";
  import { itemCursor } from "../stores/itemCursor.js";

  export let boardcur = null;
  export let listcur = null;
  export let edit = false;

  const disbatch = createEventDispatcher();

  let listDiv = null;

  afterUpdate(() => {
    //
    // Make sure the cursor is fully visible by scrolling.
    //
    if (
      $listCursor === listcur &&
      typeof listDiv !== "undefined" &&
      listDiv !== null
    ) {
      //
      // There is a list selected. Make sure it's in view.
      //
      const elRight = listDiv.offsetLeft + listDiv.offsetWidth;
      const elLeft = listDiv.offsetLeft;

      const elParentRight =
        listDiv.parentNode.offsetLeft + listDiv.parentNode.offsetWidth;
      const elParentLeft = listDiv.parentNode.offsetLeft;

      // check if right side of the element is not in view
      if (elRight > elParentRight + listDiv.parentNode.scrollLeft) {
        listDiv.parentNode.scrollLeft = elRight - elParentRight;
        if (listDiv.nextElementSibling !== null) {
          //
          // This is the last list. Make sure the new list button is shown.
          //
          listDiv.parentNode.scrollLeft += 205;
        }
      } else if  (elLeft < elParentLeft + listDiv.parentNode.scrollLeft) {
        // 
        // Left element is not in view. 
        //
        listDiv.parentNode.scrollLeft = elLeft - elParentLeft;
      }
    }
  });

  async function nameChanged(e) {
    console.log("nameChanged: ", e.detail, $Kanban, boardcur, listcur);
    $Kanban.boards[boardcur].lists[listcur].name = e.detail.name;
    await $Kanban.SaveKanbanBoards();
  }

  async function deleteList() {
    $boardCursor = boardcur;
    $listCursor = listcur;
    await $Kanban.deleteList();
    $Kanban = $Kanban;
  }

  async function addItem() {
    $boardCursor = boardcur;
    $listCursor = listcur;
    await $Kanban.addItem();
    $Kanban = $Kanban;
  }
</script>

<div
  class="list"
  style="background-color: {$Kanban.boards[boardcur].lists[listcur].styles.listbgcolor}; color: {$Kanban.boards[boardcur].lists[listcur].styles.listtextcolor}; border-width: {$listCursor ===
  listcur
    ? $Kanban.boards[boardcur].lists[listcur].styles.cursorWidth
    : '5px'}; border-color: {$listCursor === listcur
    ? $Kanban.boards[boardcur].lists[listcur].styles.cursorColor
    : $Kanban.boards[boardcur].lists[listcur].styles.listbgcolor};"
  bind:this={listDiv}
  on:click|capture={() => {
    $listCursor = listcur;
  }}
>
  {#if $Kanban.boards[boardcur].lists[listcur] !== null}
    <div class="listheader">
      <EditH2Field
        size={"110px"}
        name={$Kanban.boards[boardcur].lists[listcur].name}
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
    <div class="itemcontainer">
      {#if $Kanban.boards[boardcur].lists[listcur].items.length !== 0}
        {#each $Kanban.boards[boardcur].lists[listcur].items as item, itemindex}
          {#if item !== null}
            <Item
              itemInfo={item}
              editItem={$listCursor === listcur && $itemCursor === itemindex
                ? edit
                : false}
              index={$listCursor === listcur ? itemindex : -2}
              on:editOff={() => {
                disbatch("editOff", {});
                edit = false;
              }}
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
