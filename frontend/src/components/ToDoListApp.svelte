<script>
  import VimInput from "./VimInput.svelte";
  import EditField from "./EditField.svelte";
  import { keyHandler } from "../stores/keyHandler.js";

  let { app = $bindable(), appindex, update, deleteApp } = $props();

  let newToDo = $state("");
  let oldkbhdl = $state(null);
  let focus = $state(() => {});
  let setFocus = $state(false);

  function createNewTodo() {
    app.todos.push({
      description: newToDo,
      done: false,
    });
    newToDo = "";
    update();
    focus();
  }

  function nameChanged() {
    update(appindex, app);
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
    update(appindex, app);
  }

  function setNotDone(todo) {
    todo.done = false;
    var dtReg = /\s+\@done\s+\d+\/\d+\/\d+/;
    todo.description = todo.description.replace(dtReg, "");
    update(appindex, app);
  }

  async function editoff() {
    await update(appindex, app);
  }

  async function deleteTodo(todoindex) {
    app.todos.splice(todoindex, 1);
    await update(appindex, app);
  }

  async function editTodo(todoindex) {
    let desc = app.todos[todoindex].description;
    newToDo = desc;
    await deleteTodo(todoindex);
  }
</script>

<div
  class="ToDoList"
  onmouseover={() => {
    setFocus = true;
    focus();
  }}
>
  <div class="header">
    <EditField bind:name={app.name} {nameChanged} {editoff} type={"h2"} />
    <span class="todographicbackheader" onclick={() => deleteApp(appindex)}
      >❌</span
    >
  </div>
  <div class="todobottom">
    <VimInput
      bind:value={newToDo}
      show={true}
      short={true}
      {focus}
      {setFocus}
      onfocusin={() => {
        if (oldkbhdl === null && $keyHandler !== null) {
          oldkbhdl = $keyHandler;
        }
        $keyHandler = null;
      }}
      onfocusout={() => {
        if (oldkbhdl !== null && $keyHandler === null) {
          $keyHandler = oldkbhdl;
          oldkbhdl = null;
        }
      }}
      oninput={() => {
        createNewTodo();
      }}
    />
    <div class="todoContainer">
      {#each app.todos as todo, index}
        {#if !todo.done}
          <div class="tododiv">
            <span
              class="todographicfront"
              onclick={() => {
                todo.done = false;
                setDone(todo);
              }}>🔲</span
            >
            <p class="todotext">{todo.description}</p>
            <span class="todographicback" onclick={() => deleteTodo(index)}
              >❌</span
            >
            <span class="todographiclast" onclick={() => editTodo(index)}>
              ✏️</span
            >
          </div>
        {/if}
      {/each}
      {#each app.todos as todo, index}
        {#if todo.done}
          <div class="tododiv">
            <span
              class="todographicfront"
              onclick={() => {
                todo.done = false;
                setNotDone(todo);
              }}>✅</span
            >
            <p class="todotext">{todo.description}</p>
            <span class="todographicback" onclick={() => deleteTodo(index)}
              >❌</span
            >
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>

<style>
  .todobottom {
    display: flex;
    flex-direction: column;
    margin: 0px;
    padding: 0px;
  }

  .ToDoList {
    display: flex;
    flex-direction: column;
    margin: 5px 0px 5px 10px;
    border: 3px solid rgba(255, 255, 255, 0.6);
    border-radius: 10px;
    padding: 5px;
  }

  .header {
    display: flex;
    flex-direction: row;
  }

  .todographicfront {
    height: 10px;
    margin: 0px 5px 5px 5px;
    cursor: pointer;
  }

  .todographicbackheader {
    height: 10px;
    margin: 4px 5px 5px auto;
    cursor: pointer;
  }

  .todographicback {
    height: 10px;
    margin: 0px 5px 5px auto;
    cursor: pointer;
  }

  .todographiclast {
    height: 10px;
    margin: 5px;
    cursor: pointer;
  }

  .todotext {
    margin: 5px auto 5px 5px;
    cursor: pointer;
  }

  .tododiv {
    display: flex;
    flex-direction: row;
    margin: 5px;
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
    cursor: pointer;
  }
</style>
