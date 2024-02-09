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
    disbatch("nameChanged", {
      name: editField.value,
    });
    editH2Flag = false;
    if (origKeyHandler !== null) {
      $keyHandler = origKeyHandler;
      origKeyHandler = null;
    }
  }
</script>

<div class="editH2Field">
  {#if editH2Flag}
    <input
      class="eListName"
      type="text"
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
    <h2
      on:dblclick={() => {
        editName();
      }}
    >
      {name}
    </h2>
  {/if}
</div>

<style>
  .eListName {
    background-color: rgba(255, 255, 255, 0.3);
    margin: 10px;
    padding: 10px;
    border-radius: 10px;
    width: 360px;
  }

  .editH2Field {
    cursor: pointer;
    margin: 5px 0px 10px 0px;
  }
</style>
