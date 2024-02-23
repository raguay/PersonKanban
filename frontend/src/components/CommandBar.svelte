<script>
  import { onMount, afterUpdate, tick } from "svelte";
  import showdown from "showdown";
  import { commandBar } from "../stores/commandBar.js";
  import { keyHandler } from "../stores/keyHandler.js";
  import { ctrlKey } from "../stores/ctrlKey.js";
  import { shiftKey } from "../stores/shiftKey.js";
  import { metaKey } from "../stores/metaKey.js";
  import { altKey } from "../stores/altKey.js";
  import { key } from "../stores/key.js";
  import { skipKey } from "../stores/skipKey.js";
  import { lastCommand } from "../stores/lastCommand.js";
  import { boardCursor } from "../stores/boardCursor.js";
  import { Kanban } from "../stores/Kanban.js";

  let inputDiv = null;
  let inputVal = null;
  let commandListDiv = null;
  let currentCommandDiv = null;
  let commandDescriptionDiv = null;
  let commandlist = [];
  let oldKeyHandler = null;
  let handlekey = true;
  let cursor = 0;
  let listdis = "";

  onMount(() => {
    //
    // Default to getting all the commands.
    //
    commandlist = $commandBar.commands;

    //
    // Set our keyboard handler and save the previous one.
    //
    oldKeyHandler = $keyHandler;
    $keyHandler = KeyboardHandler;

    //
    // Focus the input first.
    //
    inputDiv.focus();

    return () => {
      //
      // If the oldKeyHanger isn't null, set it back to the $keyHandler.
      //
      if (oldKeyHandler !== null) {
        $keyHandler = oldKeyHandler;
        oldKeyHandler = null;
      }
    };
  });

  afterUpdate(() => {
    //
    // Make sure the cursor is fully visible by scrolling.
    //
    if (currentCommandDiv !== null) {
      //
      // There is a selected. Make sure it's in view.
      //
      currentCommandDiv.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  });

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

      //
      // State 0 is the main entry state. Get the command and accumulator values.
      //
      switch ($key) {
        case "h":
          commandListDiv.focus();
          listdis = "list";
          break;

        case "g":
          if (listdis === "list") {
            cursor = commandlist.length - 1;
          }
          break;

        case "G":
          if (listdis === "list") {
            cursor = 0;
          }
          break;

        case "j":
          if (listdis === "list") {
            cursor++;
            if (cursor >= commandlist.length) cursor = commandlist.length - 1;
          }
          break;

        case "k":
          if (listdis === "list") {
            cursor--;
            if (cursor < 0) cursor = 0;
          }
          break;

        case "l":
          commandDescriptionDiv.focus();
          listdis = "dis";
          break;

        case "i":
          //
          // Clear the state and focus the input.
          //
          inputDiv.focus();
          break;

        case ":":
          $commandBar.clearShowing();
          $commandBar = $commandBar;
          break;

        case "Tab":
          inputVal = commandlist[cursor].name;
          inputDiv.focus();
          break;

        case "Escape":
          $commandBar.clearShowing();
          $commandBar = $commandBar;
          break;

        default:
          break;
      }
    }
  }

  function mdToHtml(string) {
    let result = "";
    if (string !== null && string !== "") {
      let converter = new showdown.Converter();
      result = converter.makeHtml(string);
    }
    return result;
  }

  function searchCommands() {
    commandlist = $commandBar.commands.filter((item) =>
      item.name
        .toLowerCase()
        .match(inputVal.toLowerCase().split("").join(".*")),
    );
    cursor = 0;
  }
</script>

<div id="CBFull">
  <div
    id="commandBarDiv"
    style="background-color: {$Kanban[$boardCursor].styles.listbgcolor};
           color: {$Kanban[$boardCursor].styles.listtextcolor};
           font-family: {$Kanban[$boardCursor].styles.font};
           font-size: {$Kanban[$boardCursor].styles.fontsize}px;"
  >
    <input
      id="comandBarInput"
      type="text"
      bind:this={inputDiv}
      bind:value={inputVal}
      on:keydown={async (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          $commandBar.clearShowing();
          $commandBar = $commandBar;
        } else if (e.key === "Enter") {
          //
          // If a valid command is in the commandBar, then run it.
          //
          e.preventDefault();
          const cmd = $commandBar.getCommand(inputVal);
          if (cmd !== null) {
            cmd.command();
            $lastCommand = cmd.name;
          }

          //
          // Close the commandBar.
          //
          await tick();
          $commandBar.clearShowing();
          $commandBar = $commandBar;
          $skipKey = true;
        }
      }}
      on:input={searchCommands}
      on:focusin={() => {
        handlekey = false;
        listdis = "";
      }}
      on:focusout={() => {
        handlekey = true;
        listdis = "list";
      }}
    />
    <div id="ListContainer">
      <div
        id="commandList"
        style="background-color: {$Kanban[$boardCursor].styles
          .listbgcolor}; color: {$Kanban[$boardCursor].styles.listtextcolor};
               border-width: {listdis === 'list' ? 2 : 0}px;"
        bind:this={commandListDiv}
      >
        {#if commandlist.length > 0}
          {#each commandlist as cmd, num}
            {#if num === cursor}
              <p
                class="commandName"
                style="text-decoration-line: underline; text-decoration-style: double;"
                bind:this={currentCommandDiv}
              >
                {cmd.name}
              </p>
            {:else}
              <p class="commandName">{cmd.name}</p>
            {/if}
          {/each}
        {/if}
      </div>
      <div
        id="commandDescription"
        bind:this={commandDescriptionDiv}
        style="background-color: {$Kanban[$boardCursor].styles
          .listbgcolor}; color: {$Kanban[$boardCursor].styles.listtextcolor};
               border-width: {listdis === 'dis' ? 2 : 0}px;"
      >
        {#if $commandBar.commands[cursor].type === "text"}
          <p>{$commandBar.commands[cursor].description}</p>
        {:else if $commandBar.commands[cursor].type === "html"}
          {@html $commandBar.commands[cursor].description}
        {:else if $commandBar.commands[cursor].type === "md"}
          {@html mdToHtml($commandBar.commands[cursor].description)}
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  #CBFull {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 300;
  }

  #commandBarDiv {
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 80%;
    max-height: 80%;
    margin: auto;
    padding: 10px;
    border: 5px;
    border-radius: 10px;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.5);
  }

  #comandBarInput {
    background-color: rgba(255, 255, 255, 0.3);
    margin: 10px;
    padding: 10px;
    border-radius: 10px;
  }

  #ListContainer {
    display: flex;
    flex-direction: row;
    margin: 0px;
    padding: 0px;
    height: 90%;
    width: 100%;
  }

  #commandList {
    display: flex;
    flex-direction: column;
    width: 48%;
    height: 100%;
    max-height: 100%;
    margin: 5px;
    overflow-x: hidden;
    overflow-y: scroll;
    border-style: solid;
  }

  #commandDescription {
    display: flex;
    flex-direction: column;
    width: 48%;
    height: 100%;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    margin: 5px;
    border-style: solid;
  }

  .commandName {
    margin: 5px 10px;
  }
</style>
