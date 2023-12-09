<script>
  import { createEventDispatcher, tick } from "svelte";
  import { keyHandler } from "../stores/keyHandler.js";

  export let name;

  let editField;
  let editH2Flag = false;
  let origKeyHandler = null;

  const disbatch = createEventDispatcher();

  async function editName() {
    editH2Flag = true;
    await tick();
    if ($keyHandler !== null) {
      origKeyHandler = $keyHandler;
      $keyHandler = null;
    }
    editField.focus();
  }

  function nameChanged() {
    if (origKeyHandler !== null) {
      $keyHandler = origKeyHandler;
      origKeyHandler = null;
    }
    disbatch("nameChanged", {
      name: editField.value,
    });
    editH2Flag = false;
  }
</script>

<div class="editH2Field">
  {#if editH2Flag}
    <textarea
      class="eListName"
      bind:value={name}
      bind:this={editField}
      on:keydown={(e) => {
        if (e.code === "Enter") nameChanged();
      }}
      on:blur={() => {
        nameChanged();
      }}
    />
  {:else}
    <p
      class="pListName"
      on:dblclick={() => {
        editName();
      }}
    >
      {name}
    </p>
  {/if}
</div>

<style>
  .eListName {
    background-color: rgba(255, 255, 255, 0.3);
    margin: 10px;
    padding: 10px;
    border-radius: 10px;
    width: 350px;
  }

  .pListName {
    margin: 5px;
    padding: 0px;
    min-height: 16px;
  }

  .editH2Field {
    cursor: pointer;
  }
</style>
