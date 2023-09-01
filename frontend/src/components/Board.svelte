<div id='MainBoard' >
  <div style="display: none;">
    {update}
  </div>
  <div id='tabs'>
    {#each boardInfo as board, index }
      {#if currentBoard === board.id}
        <div class="tab"
            style="background-color: {styles.selectTabColor}; color: {styles.selectTabTextColor}"
            data-key={index}
            on:dblclick={(e) => { editName(board.id); }}
        >
          <span style="background-color: {styles.selectTabColor}; color: {styles.selectTabTextColor}"
                class='tabName'>
                {#if editNameFlag}
                  <input type='text'
                         bind:value={board.name}
                         bind:this={editField}
                         on:keydown={(e) => {if(e.code === 'Enter') editNameFlag = false; }}
                         on:blur={() => { editNameFlag = false; }}
                  />
                {:else}
                  {board.name}
                {/if}
          </span>
      </div>
      {:else}
        <div class="tab"
             style="background-color: {styles.unselectTabColor}; color: {styles.unselectTabTextColor}"
             data-key={index}
             on:click={() => {setBoard(board.id);}}
        >
            <span class='tabName'
                  style="background-color: {styles.unselectTabColor}; color: {styles.unselectTabTextColor}"
            >
                {board.name}
            </span>
        </div>
      {/if}
    {/each}
    <div class="tab"
         style="background-color: {styles.unselectTabColor}; color: {styles.unselectTabTextColor}"
         data-key={-1}
         on:click={(e) => {addBoard();}}
    >
      <span class='tabName'
            style="background-color: {styles.unselectTabColor}; 
                   color: {styles.unselectTabTextColor};
                   font-size: 30px; line-height: 20px;"
      >
        +
      </span>
    </div>
  </div>
  <ListContainer 
    lists={boardInfo.find(board => currentBoard === board.id )}
    styles={styles}
    user={user}
    on:addlist={addList}
    on:deleteList={deleteList}
    on:additem={addItem}
    on:deleteItem={deleteItem}
    on:newItemMsg={newItemMsg}
    on:newItemApp={newItemApp}
    on:appUpdate={appUpdate}
    on:listUpdate={listUpdate}
  />
</div>

<style>
  #MainBoard {
    display: flex;
    flex: 1fr;
    flex-direction: column;
    margin: 0px;
    padding: 10px;
    height: 90%;
  }

  #tabs {
    display: flex;
    flex-direction: row;
    margin: 0px 10px 0px 0px;
    overflow-x: auto;
    overflow-y: hidden;
  }
  
  #tabs::-webkit-scrollbar {
    height: 6px;
    background-color: rgba(255,255,255,0.3);
    border-radius: 6px;
  }

  #tabs::-webkit-scrollbar-thumb {
    height: 6px;
    background-color: rgba(10,10,10,0.5);
    border-radius: 6px;
  }

  .tab {
    border-top: 3px gray;
    border-right: 3px gray;
    border-left: 3px gray;
    border-bottom: 0px;
    border-radius: 20px 5px 0px 0px;
    height: 1em;
    padding: 10px;
    cursor: pointer;
    user-select: none;
  }

  .tab span input[type=text] {
    background-color: rgba(255,255,255,0.3);
    margin: 0px;
    padding: 0px 8px;
    border-radius: 10px;
  }

  .tabName {
    background-color: white;
    color: black;
    margin: 5px;
    white-space: nowrap;
  }

  .Selected, .Selected span {
    background-color: lightblue;
  }

  .Unselected, .Unselected span {
    background-color: white;
  }

</style>

<script>
  import { createEventDispatcher, tick } from 'svelte';
  import ListContainer from './ListContainer.svelte';

  export let boardInfo;
  export let styles;
  export let update;
  export let user;
  
  let currentBoard = 0;
  let editNameFlag = false;
  let editField;
  
  const dispatch = createEventDispatcher();
  
  function getCurrentLists() {
    return ;
  }

  function setBoard(ind) {
    currentBoard = ind;
  }

  function addBoard() {
    dispatch('addboard',{});
  }

  async function editName( num ) {
    editNameFlag = true;
    await tick();
    editField.focus();
  }

  function addList(e) { 
    dispatch('addlist', {
      board: currentBoard
    })
  }
  
  function deleteList(e) { 
    dispatch('deleteList', {
      board: currentBoard,
      list: e.detail.list
    }); 
  }

  function addItem(e) { 
    dispatch('additem', {
      list: e.detail.list,
      board: currentBoard
    })
  }

  function deleteItem(e) {
    dispatch('deleteItem', {
      item: e.detail.item,
      list: e.detail.list,
      board: currentBoard
    })
  }

  function newItemMsg(e) {
    dispatch('newItemMsg', {
      item: e.detail.item,
      list: e.detail.list,
      board: currentBoard,
      msg: e.detail.msg
    })
  }
  
  function newItemApp(e) {
    dispatch('newItemApp', {
      item: e.detail.item,
      list: e.detail.list,
      board: currentBoard,
      app: e.detail.app
    })
  }
  
  function appUpdate(e) {
    dispatch('appUpdate', {
      item: e.detail.item,
      list: e.detail.list,
      board: currentBoard,
      app: e.detail.app
    })
  }

  function listUpdate(e) {
    dispatch('listUpdate', {
      list: e.detail.list,
      board: currentBoard
    });
  }
</script>

