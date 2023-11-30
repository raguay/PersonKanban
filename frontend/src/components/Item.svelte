<script>
  import { createEventDispatcher } from "svelte";
  import EditH2Field from "./EditH2Field.svelte";
  import EditPField from "./EditPField.svelte";
  import ToDoListApp from "./ToDoListApp.svelte";

  export let styles;
  export let itemInfo;

  let edit = false;
  let newMsg;

  const disbatch = createEventDispatcher();

  function editItem(e) {
    edit = true;
  }

  function deleteItem(e) {
    disbatch("deleteItem", {
      item: itemInfo.id,
    });
  }

  function saveItem(e) {
    edit = false;
    disbatch("saveItem", {
      item: itemInfo,
    });
  }

  function nameChanged(e) {
    itemInfo.name = e.detail.name;
    disbatch("saveItem", {
      item: itemInfo,
    });
  }

  function descriptionChanged(e) {
    itemInfo.description = e.detail.name;
    disbatch("saveItem", {
      item: itemInfo,
    });
  }

  function createNewTextMsg() {
    var td = new Date();
    var tdate =
      td.getDate() +
      "/" +
      (td.getDay().toString().length === 1 ? "0" + td.getDay() : td.getDay()) +
      "/" +
      td.getFullYear() +
      " " +
      td.getHours() +
      ":" +
      (td.getMinutes().toString().length === 1
        ? "0" + td.getMinutes()
        : td.getMinutes()) +
      ":" +
      (td.getSeconds().toString().length === 1
        ? "0" + td.getSeconds()
        : td.getSeconds());
    let msgID = 0;
    itemInfo.notes.map((note) => {
      if (note.id >= msgID) msgID = note.id + 1;
    });
    disbatch("newItemMsg", {
      item: itemInfo.id,
      msg: {
        id: msgID,
        date: tdate,
        type: "text",
        info: typeof newMsg !== "undefined" ? newMsg : "",
      },
    });
    newMsg = "";
  }

  function createToDoList() {
    var newID = 0;
    itemInfo.apps.map((app) => {
      if (app.id >= newID) newID = app.id + 1;
    });
    disbatch("newItemApp", {
      item: itemInfo.id,
      app: {
        id: newID,
        name: itemInfo.name + ": " + "ToDoListApp",
        code: ToDoListApp,
        styles: [],
        todos: [],
      },
    });
  }

  function appUpdate(e) {
    disbatch("appUpdate", e.detail);
  }
</script>

<div
  class="item"
  style="background-color: {styles.itembgcolor}; color: {styles.itemtextcolor};"
  on:dblclick={editItem}
>
  <h2>{itemInfo.name}</h2>
  <p>{itemInfo.description}</p>
  {#if edit}
    <div class="editDialogBG">
      <div
        class="editDialog"
        style="background-color: {styles.dialogBGColor}; color: {styles.dialogTextColor};"
        on:save={saveItem}
      >
        <EditH2Field
          name={itemInfo.name}
          {styles}
          on:nameChanged={nameChanged}
        />
        <EditPField
          name={itemInfo.description}
          {styles}
          on:nameChanged={descriptionChanged}
        />
        <div class="itemContainer">
          {#each itemInfo.apps as app}
            <svelte:component
              this={app.code}
              {app}
              item={itemInfo}
              on:appUpdate={appUpdate}
            />
          {/each}
          <input
            class="newMsg"
            type="text"
            bind:value={newMsg}
            on:keydown={(e) => {
              if (e.code === "Enter") createNewTextMsg();
            }}
          />
          <div class="appButtons">
            <button on:click={createToDoList}>Todo List</button>
          </div>
          <div class="buttonRow">
            <button on:click={saveItem}>Save</button>
            <button on:click={deleteItem}>Delete</button>
          </div>
          {#if itemInfo.notes.length !== 0}
            {#each itemInfo.notes as note}
              <div class="note">
                <div class="noteHeader">
                  <div class="noteDate">
                    {note.date}
                  </div>
                </div>
                {#if note.type === "text"}
                  <p class="noteText">{note.info}</p>{/if}
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .item {
    margin: 5px 5px 10px 5px;
    padding: 10px;
    align-content: center;
    border: 5px solid transparent;
    border-radius: 5px;
    text-align: left;
  }

  .appButtons {
    display: flex;
    flex-direction: row;
    margin: 0px 0px 10px 0px;
  }

  .appButtons button {
    padding: 5px;
    margin: 0px 10px 0px 0px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.6);
  }

  .item h2 {
    margin: 5px 0px 10px 0px;
  }

  .newMsg {
    margin: 5px 0px 10px 0px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 10px;
    color: inherit;
  }

  .editDialogBG {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .editDialog {
    width: 400px;
    height: 80%;
    margin: 100px auto;
    display: flex;
    flex-direction: column;
    border: 5px solid transparent;
    border-radius: 10px;
  }

  .note {
    margin: 5px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.6);
    border: 3px solid transparent;
    border-radius: 10px;
  }

  .noteHeader {
    display: flex;
    flex-direction: row;
    margin: 5px 0px 10px 0px;
    font-size: 10px;
  }

  .noteDate {
    flex: 1;
    font-size: 10px;
  }

  .noteText {
    flex: 1;
  }

  .buttonRow {
    display: flex;
    flex-direction: row;
    margin: 0px 0px 10px 0px;
  }

  .buttonRow button {
    padding: 5px;
    margin: 0px 10px 0px 0px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.6);
  }

  .itemContainer {
    overflow-y: auto;
    overflow-x: hidden;
  }

  .itemContainer::-webkit-scrollbar {
    width: 6px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 6px;
  }

  .itemContainer::-webkit-scrollbar-thumb {
    background-color: rgba(10, 10, 10, 0.5);
    border-radius: 6px;
  }
</style>
