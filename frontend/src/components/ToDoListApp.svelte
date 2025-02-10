<script>
  import { createEventDispatcher } from "svelte";
  import EditH2Field from "./EditH2Field.svelte";
  import { keyHandler } from "../stores/keyHandler.js";

  let { app = $bindable() } = $props();

  let newToDo = $state('');
  let oldkbhdl = $state(null);
  let todoInputEl = $state(null);

  const disbatch = createEventDispatcher();

  function createNewTodo() {
    app.todos.push({
      description: newToDo,
      done: false,
    });
    newToDo = "";
    app = app;
    saveApp();
  }

  function saveApp() {
    disbatch("appUpdate", {
      app: app,
    });
  }

  function nameChanged(e) {
    app.name = e.detail.name;
    saveApp();
  }

  function setDone(todo) {
    todo.done = true;
    var td = new Date();
    todo.description +=
      " @done " +
      (td.getMonth() + 1) +
      "/" +
      td.getDay() +
      "/" +
      td.getFullYear();
    saveApp();
  }

  function setNotDone(todo) {
    todo.done = false;
    var dtReg = /\s+\@done\s+\d+\/\d+\/\d+/;
    todo.description = todo.description.replace(dtReg, "");
    saveApp();
  }
</script>

<div class="ToDoList">
  <EditH2Field name={app.name} on:nameChanged={nameChanged} />
  <input
    class="todoInput"
    type="text"
    bind:value={newToDo}
    bind:this={todoInputEl}
    onfocusin={() => {
      oldkbhdl = $keyHandler;
      $keyHandler = null;
    }}
    onfocusout={() => {
      $keyHandler = oldkbhdl;
      oldkbhdl = null;
    }}
    onkeydown={(e) => {
      if (e.code === "Enter") {
        e.preventDefault();
        createNewTodo();
        todoInputEl.focus();
      }
    }}
  />
  <div class="todoContainer">
    {#each app.todos as todo}
      {#if !todo.done}
        <p
          onclick={(e) => {
            todo.done = true;
            setDone(todo);
          }}
        >
          🔲 {todo.description}
        </p>
      {/if}
    {/each}
    {#each app.todos as todo}
      {#if todo.done}
        <p
          onclick={(e) => {
            todo.done = false;
            setNotDone(todo);
          }}
        >
          ✅ {todo.description}
        </p>
      {/if}
    {/each}
  </div>
</div>

<style>
  .ToDoList {
    display: flex;
    flex-direction: column;
    margin: 5px 0px 5px 10px;
    border: 3px solid rgba(255,255,255,.6);
    border-radius: 10px;
    padding: 5px;
  }

  .todoContainer {
    margin: 5px 5px 5px 10px;
  }

  .todoInput {
    margin: 5px;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 10px;
    color: inherit;
    padding: 5px;
  }
</style>
