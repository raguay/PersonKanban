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
  let acc = "";
  let state = 0;
  let command = null;
  let direction = "";

  onMount(() => {
    //
    // Get the data for the right board.
    //
    boardData = $Kanban.boards.filter((item) => item.id === board)[0];

    //
    // Setup the keyboard handler.
    //
    $keyHandler = listKeyHandler;
    $listCursor = 0;
    $itemCursor = -1;
  });

  beforeUpdate(() => {
    //
    // Make sure we have the latest data.
    //
    boardData = $Kanban.boards.filter((item) => item.id === board)[0];
  });

  function saveBoardData() {
    $Kanban.boards = $Kanban.boards.map((item) => {
      console.log(item);
      if (item.id === board) {
        return boardData;
      } else {
        return item;
      }
    });
    dispatch("UpdateBoard", board);
  }

  function listKeyHandler(e) {
    $ctrlKey = e.ctrlKey;
    $shiftKey = e.shiftKey;
    $metaKey = e.metaKey;
    $altKey = e.altKey;
    $key = e.key;

    //
    // If skpkey is true, don't process the key.
    //
    if (!$skipKey) {
      processKey(e);
    }
    $skipKey = false;
  }

  function clearState() {
    //
    // Clear out the variables used in processing the keyboard commands.
    //
    $listCursor = $listCursor;
    $Kanban = $Kanban;
    state = 0;
    command = null;
    direction = "";
    acc = "";
  }

  function processKey(e) {
    //
    // This is just normal key processing. Run the command for that key.
    //
    switch (state) {
      case 0:
        //
        // State 0 is the main entry state. Get the command and accumulator values.
        //
        switch ($key) {
          case "h":
            e.preventDefault();
            command = moveListCursorLeft;
            break;

          case "k":
            e.preventDefault();
            command = moveItemCursorUp;
            break;

          case "j":
            e.preventDefault();
            command = moveItemCursorDown;
            break;

          case "l":
            e.preventDefault();
            command = moveListCursorRight;
            break;

          case "m":
            e.preventDefault();
            if ($itemCursor === -1) {
              command = moveList;
            } else {
              command = moveItem;
            }
            //
            // Goto the one state to capture the direction.
            //
            state = 1;
            break;

          case "Escape":
            e.preventDefault();
            $itemCursor = -1;
            clearState();
            break;

          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            e.preventDefault();
            acc = acc + $key;
            break;

          default:
            acc = "";
            state = 0;
            command = null;
            break;
        }
        break;
      case 1:
        //
        // This case is for getting the direction for a command.
        //
        switch ($key) {
          case "h":
            e.preventDefault();
            state = 0;
            direction = "l";
            break;

          case "k":
            e.preventDefault();
            state = 0;
            direction = "u";
            break;

          case "j":
            e.preventDefault();
            direction = "d";
            state = 0;
            break;

          case "l":
            e.preventDefault();
            direction = "r";
            state = 0;
            break;

          default:
            //
            // A valid direction wasn't given. Abort the command.
            //
            clearState();
            break;
        }
        break;
    }
    if (state === 0) {
      //
      // Do the command as many times as the acc says.
      //
      if (command !== null) {
        //
        // Get the acc amount. If blank, at least run the command once.
        //
        let times = 0;
        if (acc === "") {
          times = 1;
        } else {
          times = parseInt(acc);
        }

        //
        // Execute the command the correct number of times.
        //
        for (var i = 0; i < times; i++) {
          command();
        }

        //
        // After executing the command, we need to set the states back to the beginning.
        //
        clearState();
      }
    }
  }

  //
  // Commands for working with the lists and items.
  //

  function moveItem() {
    let newitemindex = $itemCursor;
    switch (direction) {
      case "u":
        newitemindex--;
        break;

      case "d":
        newitemindex++;
        break;
    }
    if (newitemindex < 0) newitemindex = 0;
    if (boardData.lists[$listCursor].items.length - 1 < newitemindex)
      newitemindex = boardData.lists[$listCursor].items.length - 1;
    if (newitemindex !== $itemCursor) {
      //
      // We have a valid move.
      //
      let orig = structuredClone(
        boardData.lists[$listCursor].items[$itemCursor]
      );
      boardData.lists[$listCursor].items[$itemCursor] = structuredClone(
        boardData.lists[$listCursor].items[newitemindex]
      );
      boardData.lists[$listCursor].items[newitemindex] = structuredClone(orig);
      $itemCursor = newitemindex;
    } else {
      //
      // It was a move to a different list.
      //
      let newlistindex = $listCursor;
      switch (direction) {
        case "l":
          newlistindex--;
          break;

        case "r":
          newlistindex++;
          break;
      }
      if (newlistindex < 0) newlistindex = 0;
      if (boardData.lists.length - 1 < newlistindex)
        newlistindex = boardData.lists.length - 1;
      if (newlistindex !== $listCursor) {
        //
        // Move to the new list index.
        //
        let item = structuredClone(
          boardData.lists[$listCursor].items[$itemCursor]
        );
        boardData.lists[$listCursor].items.splice($itemCursor, 1);
        boardData.lists[newlistindex].items = [
          item,
          ...boardData.lists[newlistindex].items,
        ];
        $listCursor = newlistindex;
        $itemCursor = 0;
      }
    }
    saveBoardData();
  }

  function moveList() {
    let newlistindex = $listCursor;
    switch (direction) {
      case "l":
        newlistindex--;
        break;

      case "r":
        newlistindex++;
        break;
    }
    if (newlistindex < 0) newlistindex = 0;
    if (boardData.lists.length - 1 < newlistindex)
      newlistindex = boardData.lists.length - 1;
    if (newlistindex !== $listCursor) {
      //
      // We have a valid move.
      //
      let orig = structuredClone(boardData.lists[$listCursor]);
      boardData.lists[$listCursor] = structuredClone(
        boardData.lists[newlistindex]
      );
      boardData.lists[newlistindex] = structuredClone(orig);
      $listCursor = newlistindex;
    }
    saveBoardData();
  }

  function moveListCursorLeft() {
    //
    // Move to the list to the left if any.
    //
    $listCursor = $listCursor - 1;
    if ($listCursor < 0) $listCursor = 0;
  }

  function moveListCursorRight() {
    //
    // Move to the list to the right if any.
    //
    $listCursor = $listCursor + 1;
    if ($listCursor >= $Kanban.boards[board].lists.length)
      $listCursor = $Kanban.boards[board].lists.length - 1;
  }

  function moveItemCursorUp() {
    //
    // Move to the list item down one if any.
    //
    $itemCursor = $itemCursor - 1;
    if ($itemCursor < 0) $itemCursor = 0;
  }

  function moveItemCursorDown() {
    //
    // Move to the list item up one if any.
    //
    let items = $Kanban.boards[board].lists[$listCursor].items;
    if (items.length !== 0) {
      $itemCursor = $itemCursor + 1;
      if ($itemCursor >= items.length) $itemCursor = items.length - 1;
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
