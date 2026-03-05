<script>
  import VimInput from "./VimInput.svelte";
  import EditField from "./EditField.svelte";
  import { DateTime } from "luxon";
  import { kbstate } from "../stores/kbstate.js";
  import { preferences } from "../stores/preferences.js";

  let { app = $bindable(), appindex, update, deleteApp } = $props();

  let newToDo = $state("");
  let focus = $state(() => {});
  let setFocus = $state(false);
  let originalKBS = 0;
  let editflag = false;

  const dtReg = /\s+\@done\s+\d+\/\d+\/\d+/;

  async function createNewTodo() {
    app.todos.push({
      description: newToDo,
      done: false,
    });
    newToDo = "";
    await update(appindex, app);
    focus();
  }

  async function nameChanged() {
    $kbstate = originalKBS;
    originalKBS = 0;
    await update(appindex, app);
  }

  async function setDone(todo) {
    todo.done = true;
    todo.description +=
      " @done " + DateTime.now().toFormat($preferences.prefs.dateformat);
    await update(appindex, app);
  }

  async function setNotDone(todo) {
    todo.done = false;
    todo.description = todo.description.replace(dtReg, "");
    await update(appindex, app);
  }

  async function deleteTodo(todoindex) {
    app.todos.splice(todoindex, 1);
    await update(appindex, app);
  }

  async function editTodo(todoindex) {
    newToDo = app.todos[todoindex].description;
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
    <EditField
      bind:name={app.name}
      oninput={nameChanged}
      edit={editflag}
      type={"h2"}
      onfocusin={() => {
        originalKBS = $kbstate;
        $kbstate = 10;
      }}
      onfocusout={() => {
        $kbstate = originalKBS;
        originalKBS = 0;
      }}
    />
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
        originalKBS = $kbstate;
        $kbstate = 10;
      }}
      onfocusout={() => {
        $kbstate = originalKBS;
        originalKBS = 0;
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
