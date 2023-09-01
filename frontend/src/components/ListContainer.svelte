<div id='ListsContainer' style="background-color: {styles.listcontainercolor};">
  {#if typeof lists === 'object'}
    {#each lists.lists as list }
      <List listInfo={list}
            styles={styles}
            user={user}
            on:deleteList={(e) => { dispatch('deleteList', e.detail); }}
            on:addItem={(e) => { dispatch('additem', e.detail)}}
            on:deleteItem={(e) => { dispatch('deleteItem', e.detail)}}
            on:newItemMsg={(e) => { dispatch('newItemMsg', e.detail)}}
            on:newItemApp={(e) => { dispatch('newItemApp', e.detail)}}
            on:appUpdate={(e) => { dispatch('appUpdate', e.detail)}}
            on:listUpdate={(e) => { dispatch('listUpdate', e.detail)}}
      />
    {/each}
  {/if}
  <div id="addList"
       on:click={(e) => { dispatch('addlist',{}); }}
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
    background-color: rgba(255,255,255,0.3);
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
    background-color: rgba(255,255,255,0.3);
    border-radius: 6px;
  }

  #ListsContainer::-webkit-scrollbar-thumb {
    height: 6px;
    background-color: rgba(10,10,10,0.5);
    border-radius: 6px;
  }
</style>

<script>
  import { createEventDispatcher, tick } from 'svelte';
  import List from './List.svelte';

  export let lists;
  export let styles;
  export let user;
  
  const dispatch = createEventDispatcher();
 
</script>

