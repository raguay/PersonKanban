<script>
  import { onMount, tick } from "svelte";
  import EditField from "./EditField.svelte";
  import VimInput from "./VimInput.svelte";
  import ToDoListApp from "./ToDoListApp.svelte";
  import { Kanban } from "../stores/Kanban.js";
  import { ctrlKey } from "../stores/ctrlKey.js";
  import { shiftKey } from "../stores/shiftKey.js";
  import { metaKey } from "../stores/metaKey.js";
  import { altKey } from "../stores/altKey.js";
  import { key } from "../stores/key.js";
  import { itemEditkb } from "../stores/itemEditkb.js";
  import { kbstate } from "../stores/kbstate.js";

  let { itemInfo = $bindable(), closeEdit } = $props();

  let newMsg = $state("");
  let applications = [];
  let handlekey = true;
  let keystate = 0;
  let acc = "";
  let direction = "";
  let command = null;
  let editDialogDiv = null;
  let msgfocus = $state(() => {});
  let blurMsg = $state(() => {});
  let editTitle = $state(false);
  let editDesc = $state(false);
  let editMessage = $state(false);
  let itemCon = $state(null);

  onMount(async () => {
    //
    // Set the itemEditkb handler.
    //
    $itemEditkb = KeyboardHandler;
    $kbstate = 1;

    //
    // Load applications.
    //
    applications["todo"] = ToDoListApp;

    //
    // Make sure the keyboard controler state is neutral.
    //
    clearState();

    //
    // Focus the dialog and not a particular input.
    //
    await tick();
    editDialogDiv.focus();

    return () => {
      //
      // Set the kbstate to the default state.
      //
      $kbstate = 0;
    };
  });

  async function closeItemEdit() {
    //
    // Put in the original handler.
    //
    await $Kanban.SaveKanbanBoards();
    $kbstate = 0;
    closeEdit();
  }

  async function KeyboardHandler(e) {
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
      switch (keystate) {
        case 0:
          //
          // State 0 is the main entry state. Get the command and accumulator values.
          //
          switch ($key) {
            case "e":
              //
              // Get the item that needs edited.
              //
              keystate = 2;
              break;

            case "j":
              //
              // Scroll down the Div by a defined amount. TODO: make this a configurable item.
              //
              itemCon.scroll(0, itemCon.scrollTop + 100);
              break;

            case "k":
              //
              // Scroll up the Div by a defined amount. TODO: make this a configurable item.
              //
              itemCon.scroll(0, itemCon.scrollTop - 100);
              break;

            case "m":
              command = editCardMessage;
              break;

            case "s":
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
              keystate = 0;
              direction = "l";
              break;

            case "k":
              keystate = 0;
              direction = "u";
              break;

            case "j":
              direction = "d";
              keystate = 0;
              break;

            case "l":
              direction = "r";
              keystate = 0;
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
              keystate = 0;
              command = editCardTitle;
              break;

            case "d":
              //
              // This will edit the description.
              //
              command = editCardDiscription;
              keystate = 0;
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
      if (keystate === 0) {
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
            await command();
          }

          //
          // After executing the command, we need to set the states back to the beginning.
          //
          clearState();
        }
      }
    } else if (e.key === "Enter") {
      e.stopPropagation();
      e.preventDefault();
      closeItemEdit();
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
    keystate = 0;
    command = null;
    direction = "";
    acc = "";
  }

  function editCardTitle() {
    editTitle = true;
    $itemEditkb = null;
  }

  function editCardDiscription() {
    editDesc = true;
    $itemEditkb = null;
  }

  async function editCardMessage() {
    editMessage = true;
    $itemEditkb = null;
    await tick();
    msgfocus();
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
    await $Kanban.newItemMsg(
      tdate,
      "text",
      typeof newMsg !== "undefined" ? newMsg : "",
    );
    newMsg = "";
    $Kanban = $Kanban;
    blurMsg();
  }

  async function createToDoList() {
    await $Kanban.newItemApp({
      name: itemInfo.name + ": " + "ToDoApp",
      type: "todo",
      styles: {},
      todos: [],
    });
    $Kanban = $Kanban;
    itemInfo = itemInfo;
  }

  async function deleteApp(ind) {
    await $Kanban.deleteApp(ind);
    $Kanban = $Kanban;
  }

  async function appUpdate(appindex, app) {
    await $Kanban.appUpdate(appindex, app);
  }

  function exitEF() {
    $kbstate = 1;
    $itemEditkb = KeyboardHandler;
    editTitle = false;
    editDesc = false;
  }
</script>

<div class="editDialogBG">
  <div
    class="editDialog"
    style="background-color: {itemInfo.styles.dialogBGColor}; color: {itemInfo
      .styles.dialogTextColor};"
    bind:this={editDialogDiv}
  >
    <EditField
      bind:name={itemInfo.name}
      bind:edit={editTitle}
      type={"h2"}
      oninput={() => {
        exitEF();
      }}
      onblur={() => {
        exitEF();
      }}
      onfocusout={() => {
        exitEF();
      }}
    />
    <EditField
      bind:name={itemInfo.description}
      bind:edit={editDesc}
      type={"p"}
      oninput={() => {
        exitEF();
      }}
      onblur={() => {
        exitEF();
      }}
      onfocusout={() => {
        exitEF();
      }}
      setFocus={false}
    />
    <div class="itemContainer" bind:this={itemCon}>
      {#each itemInfo.apps as app, appindex}
        <ToDoListApp {app} {appindex} update={appUpdate} {deleteApp} />
      {/each}
      <div class="appButtons">
        <button
          onclick={async () => {
            await createToDoList();
          }}>Todo List</button
        >
      </div>
      <div class="newMsg">
        <h2 style="margin: 5px;">Create a Message:</h2>
        <VimInput
          bind:value={newMsg}
          show={true}
          short={true}
          setFocus={editMessage}
          bind:blur={blurMsg}
          bind:focus={msgfocus}
          onfocusin={() => {
            editMessage = true;
            editTitle = false;
            editDesc = false;
            $itemEditkb = null;
            msgfocus();
          }}
          onfocusout={() => {
            editMessage = false;
            exitEF();
          }}
          oninput={() => {
            createNewTextMsg();
            editMessage = false;
            exitEF();
          }}
        />
      </div>

      <div class="buttonRow">
        <button
          onclick={() => {
            closeItemEdit();
          }}>Save</button
        >
      </div>
      {#if itemInfo.notes.length !== 0}
        {#each itemInfo.notes as note}
          <div class="note">
            <div class="noteHeader">
              <p class="noteDate">{note.date}</p>
              <!-- svelte-ignore a11y_mouse_events_have_key_events a11y_no_static_element_interactions -->
              <span
                class="noteAction"
                onclick={() => {
                  navigator.clipboard.writeText(note.info);
                }}
              >
                📋️
              </span>
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
    padding: 10px;
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
    padding: 5px;
    background-color: rgba(255, 255, 255, 0.6);
    border: 3px solid transparent;
    border-radius: 10px;
  }

  .noteHeader {
    display: flex;
    flex-direction: row;
    margin: 0px;
    font-size: 10px;
  }

  .noteDate {
    flex: 1;
    font-size: 10px;
    margin: 0px 5px 0px 0px;
  }

  .noteAction {
    margin: 0px 5px 5px auto;
    height: 14px;
    max-height: 14px;
    cursor: pointer;
  }

  .noteText {
    flex: 1;
    user-select: text;
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
