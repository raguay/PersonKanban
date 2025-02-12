<script>
  import EditH2Field from "./EditH2Field.svelte";
  import Item from "./Item.svelte";
  import { Kanban } from "../stores/Kanban.js";
  import { boardCursor } from "../stores/boardCursor.js";
  import { listCursor } from "../stores/listCursor.js";
  import { itemCursor } from "../stores/itemCursor.js";

  let { boardcur, listcur, edit, editoff } = $props();

  let listDiv = $state(null);
  let localNameEdit = $state(false);
  let editItem = $state(false);
  let editing = false;

  $effect(() => {
    //
    // If edit has been turned off, make sure it's upward progated.
    //
    localNameEdit = $listCursor === listcur && $itemCursor < 0 ? edit : false;
    editItem = $listCursor === listcur && $itemCursor >= 0 ? edit : false;
    if (!editItem && !localNameEdit) {
      if (editing) {
        editing = false;
        $Kanban.SaveKanbanBoards();
        editoff();
      }
    } else {
      editing = true;
    }

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
      } else if (elLeft < elParentLeft + listDiv.parentNode.scrollLeft) {
        //
        // Left element is not in view.
        //
        listDiv.parentNode.scrollLeft = elLeft - elParentLeft;
      }
    }
  });

  async function deleteList() {
    $boardCursor = boardcur;
    $listCursor = listcur;
    await $Kanban.deleteList();
  }

  async function addItem() {
    $boardCursor = boardcur;
    $listCursor = listcur;
    await $Kanban.addItem();
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="list"
  style="background-color: {$Kanban.boards[boardcur].lists[listcur].styles
    .listbgcolor}; color: {$Kanban.boards[boardcur].lists[listcur].styles
    .listtextcolor}; border-width: {$listCursor === listcur
    ? $Kanban.boards[boardcur].lists[listcur].styles.cursorWidth
    : '5px'}; border-color: {$listCursor === listcur
    ? $Kanban.boards[boardcur].lists[listcur].styles.cursorColor
    : $Kanban.boards[boardcur].lists[listcur].styles.listbgcolor};"
  bind:this={listDiv}
  onkeydown={() => {}}
  onclick={(e) => {
    e.stopPropagation();
    e.preventDefault();
    $listCursor = listcur;
  }}
>
  {#if $Kanban.boards[boardcur].lists[listcur] !== null}
    <div class="listheader">
      <EditH2Field
        size={"110px"}
        bind:name={$Kanban.boards[boardcur].lists[listcur].name}
        edit={localNameEdit}
        {editoff}
      />
      <span
        class="remove"
        onkeydown={() => {}}
        onclick={() => {
          deleteList();
        }}>-</span
      >
      <span
        class="add"
        onkeydown={() => {}}
        onclick={() => {
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
              {editItem}
              index={$listCursor === listcur ? itemindex : -2}
              {editoff}
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
