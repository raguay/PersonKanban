<div class="ToDoList">
  <EditH2Field 
    name={app.name}
    styles={app.styles}
    on:nameChanged={nameChanged}
  />
  <input 
    class='todoInput'
    type='text'
    bind:value={newToDo}
    on:keydown={(e) => {if(e.code === 'Enter') createNewTodo(); }}
  />
  <div class="todoContainer" >
    {#each app.todos as todo}
      {#if !todo.done}
        <p on:click={(e) => { todo.done = true; setDone(todo); }} > ⃞  {todo.description} </p>
      {/if}
    {/each}
    {#each app.todos as todo}
      {#if todo.done}
        <p on:click={(e) => { todo.done = false; setNotDone(todo); }} >☑ {todo.description}</p>
      {/if}
    {/each}
  </div>
</div>

<style>
  .ToDoList {
    display: flex;
    flex-direction: column;
    margin: 5px 0px 5px 10px;
  }

  .todoContainer {
    margin: 5px 5px 5px 10px;
  }
  
  .todoInput {
    margin: 5px 0px 10px 0px;
    width: 100%;
    background-color: rgba(255,255,255,0.6);
    border-radius: 10px;
    color: inherit;
  }
</style>

<script>
  import { createEventDispatcher } from 'svelte';
  import EditH2Field from './EditH2Field.svelte';
 
  export let app;
  export let item;

  let newToDo;

  const disbatch = createEventDispatcher();

  function createNewTodo() {
    app.todos.push({
      description: newToDo,
      done: false
    });
    newToDo = '';
    app = app;
    saveApp();
  }

  function saveApp() {
    disbatch('appUpdate', {
      item: item.id,
      app: app
    })
  }

  function nameChanged(e) {
    app.name = e.detail.name;
    saveApp();
  }

  function setDone(todo) {
    todo.done = true;
    var td = new Date();
    todo.description += " @done " + (td.getMonth() + 1) + "/" + td.getDay() + "/" + td.getFullYear();
    saveApp();
  }

  function setNotDone(todo) {
    todo.done = false;
    var dtReg = /\s+\@done\s+\d+\/\d+\/\d+/;
    todo.description = todo.description.replace(dtReg,'');
    saveApp();
  }
</script>
