<script>
  import { createEventDispatcher, onMount } from "svelte";
  import EditH2Field from "./EditH2Field.svelte";
  import EditPField from "./EditPField.svelte";
  import ToDoListApp from "./ToDoListApp.svelte";
  import { Kanban } from "../stores/Kanban.js";
  import { keyHandler } from "../stores/keyHandler.js";
  import { ctrlKey } from "../stores/ctrlKey.js";
  import { shiftKey } from "../stores/shiftKey.js";
  import { metaKey } from "../stores/metaKey.js";
  import { altKey } from "../stores/altKey.js";
  import { key } from "../stores/key.js";

  export let itemInfo;

  let newMsg = "";
  let applications = [];
  let origKeyboardHandler = null;
  let inputKeyboardStore = null;
  let handlekey = true;
  let state = 0;
  let acc = "";
  let direction = "";
  let command = null;
  let msgInputDiv = null;
  let editDialogDiv = null;
  let editTitle = false;
  let editDesc = false;

  const disbatch = createEventDispatcher();

  onMount(() => {
    //
    // Save the original handler and install our new one.
    //
    origKeyboardHandler = $keyHandler;
    $keyHandler = KeyboardHandler;

    //
    // Load applications.
    //
    applications["todo"] = ToDoListApp;

    //
    // Make sure the keyboard controler state is neutral.
    //
    clearState();

    return () => {};
  });

  function closeItemEdit() {
    //
    // Put in the original handler.
    //
    if (inputKeyboardStore !== null) {
      $keyHandler = inputKeyboardStore;
      inputKeyboardStore = null;
    }
    if (origKeyboardHandler !== null) {
      $keyHandler = origKeyboardHandler;
      origKeyboardHandler = null;
    }
    disbatch("editOff", {});
  }

  function KeyboardHandler(e) {
    $ctrlKey = e.ctrlKey;
    $shiftKey = e.shiftKey;
    $metaKey = e.metaKey;
    $altKey = e.altKey;
    $key = e.key;

    //
    // Handle the keyboard if not in an input.
    //
    if (handlekey) {
      //
      // Take over the keyboard!
      //
      e.preventDefault();
      switch (state) {
        case 0:
          //
          // State 0 is the main entry state. Get the command and accumulator values.
          //
          switch ($key) {
            case "e":
              //
              // Get the item that needs edited.
              //
              state = 2;
              break;

            case "m":
              msgInputDiv.focus();
              break;

            case "s":
              command = closeItemEdit;
              break;

            case "Enter":
              command = closeItemEdit;
              break;

            case "Escape":
              command = closeItemEdit;
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
              acc = acc + $key;
              break;

            default:
              clearState();
              break;
          }
          break;
        case 1:
          //
          // This case is for getting the direction for a command.
          //
          switch ($key) {
            case "h":
              state = 0;
              direction = "l";
              break;

            case "k":
              state = 0;
              direction = "u";
              break;

            case "j":
              direction = "d";
              state = 0;
              break;

            case "l":
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

        case 2:
          //
          // This case is getting which item in a card to edit.
          //
          switch ($key) {
            case "t":
              //
              // This will edit the title.
              state = 0;
              command = editCardTitle;
              break;

            case "d":
              //
              // This will edit the description.
              //
              command = editCardDiscription;
              state = 0;
              break;

            default:
              //
              // A valid item to edit wasn't given. Abort the command.
              //
              clearState();
              break;
          }
          break;
      }
      if (state === 0) {
        //
        // If a command is set, do the command as many times as the acc says.
        //
        if (command !== null) {
          //
          // Get the acc amount. If blank, at least run the command once.
          //
          let times = getAcc();

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
    } else {
      if (e.key === "Enter") {
        e.preventDefault();
        closeItemEdit();
      }
    }
  }

  function getAcc() {
    let times = 0;
    if (acc === "") {
      times = 1;
    } else {
      times = parseInt(acc);
    }
    return times;
  }

  function clearState() {
    //
    // Clear out the variables used in processing the keyboard commands.
    //
    state = 0;
    command = null;
    direction = "";
    acc = "";
  }

  function editCardTitle() {
    editTitle = true;
  }

  function editCardDiscription() {
    editDesc = true;
  }

  async function saveItem(exit) {
    await $Kanban.SaveKanbanBoards();
    if(exit) {
      disbatch("editOff", {});
    }
    $Kanban = $Kanban;
  }

  function nameChanged(e) {
    itemInfo.name = e.detail.name;
    editTitle = false;
    saveItem(false);
  }

  function descriptionChanged(e) {
    itemInfo.description = e.detail.name;
    editDesc = false;
    saveItem(false);
  }

  async function createNewTextMsg() {
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
    await $Kanban.newItemMsg(tdate, "text", typeof newMsg !== "undefined" ? newMsg : "");
    newMsg = "";
    $Kanban = $Kanban;
  }

  async function createToDoList() {
    await $Kanban.newItemApp({
      name: itemInfo.name + ": " + "ToDoApp",
      type: "todo",
      styles: {},
      todos: [],
    });
    $Kanban = $Kanban;
  }

  async function appUpdate(appindex, app) {
    await $Kanban.appUpdate(appindex, app);
    $Kanban = $Kanban;
  }
</script>

<div class="editDialogBG">
  <div
    class="editDialog"
    style="background-color: {itemInfo.styles.dialogBGColor}; color: {itemInfo.styles.dialogTextColor};"
    bind:this={editDialogDiv}
  >
    <EditH2Field
      name={itemInfo.name}
      edit={editTitle}
      on:nameChanged={nameChanged}
    />
    <EditPField
      name={itemInfo.description}
      edit={editDesc}
      on:nameChanged={descriptionChanged}
    />
    <div class="itemContainer">
      {#each itemInfo.apps as app, appindex}
        <svelte:component
          this={applications[app.type]}
          {app}
          on:appUpdate={async (e) => {await appUpdate(appindex,e.detail.app)}}
        />
      {/each}
      <input
        class="newMsg"
        type="text"
        bind:this={msgInputDiv}
        bind:value={newMsg}
        on:keydown|capture={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            createNewTextMsg();
          }
        }}
        on:focus={() => {
          if (inputKeyboardStore === null && $keyHandler !== null) {
            inputKeyboardStore = $keyHandler;
            $keyHandler = null;
          }
        }}
        on:focusout={() => {
          if (inputKeyboardStore !== null && $keyHandler === null) {
            $keyHandler = inputKeyboardStore;
            inputKeyboardStore = null;
          }
        }}
      />
      <div class="appButtons">
        <button on:click={createToDoList}>Todo List</button>
      </div>
      <div class="buttonRow">
        <button
          on:click={() => {
            saveItem(true);
          }}>Save</button
        >
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
              <p class="noteText">{note.info}</p>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
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

  .newMsg {
    margin: 5px 0px 10px 0px;
    padding: 5px;
    width: 373px;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 10px;
    color: inherit;
  }

  .editDialogBG {
    position: absolute;
    top: 36px;
    left: 0px;
    width: 100%;
    height: 95%;
    background-color: rgba(0, 0, 0, 0.2);
    border: 5px solid transparent;
    border-radius: 10px;
  }

  .editDialog {
    width: 400px;
    height: 80%;
    margin: 5% auto;
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
