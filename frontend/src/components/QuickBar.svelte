<script>
  import { onMount } from "svelte";
  import VimInput from "./VimInput.svelte";
  import { keyHandler } from "../stores/keyHandler.js";
  import { boardCursor } from "../stores/boardCursor.js";
  import { listCursor } from "../stores/listCursor.js";
  import { itemCursor } from "../stores/itemCursor.js";
  import { registers } from "../stores/registers.js";
  import { Kanban } from "../stores/Kanban.js";

  let { show = $bindable() } = $props();

  let value = $state("");
  let focus = $state(() => {});
  let oldKeyHandler = null;
  let showRegs = $state(false);
  let reginput = $state(null);
  let theme = {
    modes: [
      {
        name: "normal",
        color: "blue",
        text: "white",
      },
      {
        name: "insert",
        color: "yellow",
        text: "black",
      },
      {
        name: "visual",
        color: "green",
        text: "purple",
      },
    ],
  };
  let actions = [
    {
      key: "y",
      command: saveToRegister,
      keystate: 1,
    },
    {
      key: "p",
      command: getFromRegister,
      keystate: 1,
    },
    {
      key: "s",
      command: toggleRegisters,
      keystate: 0,
    },
    {
      key: "d",
      command: deleteRegister,
      keystate: 1,
    },
  ];

  onMount(() => {
    //
    // Focus the input first.
    //
    focus();

    //
    // Store the key handler.
    //
    oldKeyHandler = $keyHandler;
    $keyHandler = null;

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

  $effect(() => {
    if (focuson) {
      focus();
    } else {
      if (reginput !== null) reginput.focus();
    }
  });

  async function saveToRegister(vimcmd, nextkey) {
    $registers.regs = $registers.regs;
    await $registers.store(nextkey, vimcmd.getValue());
  }

  async function getFromRegister(vimcmd, nextkey) {
    await vimcmd.setValue(await $registers.get(nextkey));
  }

  async function toggleRegisters(vimcmd, nextkey) {
    showRegs = ~showRegs;
  }

  async function deleteRegister(vimcmd, nextkey) {
    $registers.regs = $registers.regs;
    $registers.delete(nextkey);
  }
</script>

{#if showRegs}
  <div
    id="registers"
    style="background-color: {$Kanban.boards[$boardCursor].styles
      .commandbarbgcolor};
         color: {$Kanban.boards[$boardCursor].styles.commandbartextcolor};
         font-family: {$Kanban.boards[$boardCursor].styles.font};
         font-size: {$Kanban.boards[$boardCursor].styles.fontsize};"
  >
    <table style="border: 0px; overflow-y: scroll;">
      <thead>
        <tr>
          <th style="text-align: left;">Register</th>
          <th style="text-align: left;">Contents</th>
        </tr>
      </thead>
      <tbody>
        {#each $registers.regs as reg}
          <tr>
            <td>{reg.key}</td>
            <td>{reg.value}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<div
  id="QuickBarDiv"
  style="background-color: {$Kanban.boards[$boardCursor].styles
    .commandbarbgcolor};
         color: {$Kanban.boards[$boardCursor].styles.commandbartextcolor};
         font-family: {$Kanban.boards[$boardCursor].styles.font};
         font-size: {$Kanban.boards[$boardCursor].styles.fontsize};"
>
  <VimInput
    {value}
    {theme}
    {actions}
    bind:focus
    short={false}
    bind:show
    style="background-color: {$Kanban.boards[$boardCursor].styles
      .commandbarbgcolor};
         color: {$Kanban.boards[$boardCursor].styles.commandbartextcolor};
         font-family: {$Kanban.boards[$boardCursor].styles.font};
         font-size: {$Kanban.boards[$boardCursor].styles.fontsize};"
    oneline={true}
    oninput={async (inputVal) => {
      inputVal = inputVal.trim();
      if (inputVal !== "") {
        //
        // See if it is more than one item to add.
        //
        const items = inputVal.split(";;");
        for (let itemNum = 0; itemNum < items.length; itemNum++) {
          //
          // Split the input to a name and description. There will not always be a description.
          //
          let parts = items[itemNum].split("|");
          let newName = parts[0];
          let newDes = "";
          if (parts.length > 1) {
            newDes = parts[1];
          }

          if ($listCursor < 0 && $itemCursor < 0) {
            await $Kanban.addBoardNamed(newName, newDes);
          } else if ($listCursor >= 0) {
            if ($itemCursor >= 0) {
              //
              // Add an item.
              //
              await $Kanban.addItemNamed(newName, newDes);
            } else {
              //
              // Add a list.
              //
              await $Kanban.addListNamed(newName);
            }
          }
        }
      }
      //
      // Close the quickBar.
      //
      show = false;
    }}
  />
</div>

<style>
  #QuickBarDiv {
    position: absolute;
    bottom: 40px;
    left: 10%;
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: auto;
    padding: 10px;
    border: 5px;
    border-radius: 10px;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.5);
    z-index: 200;
  }

  #registers {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 100px;
    left: 10%;
    width: 80%;
    margin: auto;
    padding: 10px;
    border: 5px;
    border-radius: 10px;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.5);
    max-height: 70%;
  }
</style>
