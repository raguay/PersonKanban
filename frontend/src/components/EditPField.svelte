<script>
  import { createEventDispatcher, afterUpdate, tick } from "svelte";
  import { keyHandler } from "../stores/keyHandler.js";

  export let name;
  export let edit = false;

  let editField;
  let editPFlag = false;
  let origKeyHandler = null;

  const disbatch = createEventDispatcher();

  afterUpdate(() => {
    if (edit) editName();
    edit = false;
  });

  async function editName() {
    editPFlag = true;
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
    editPFlag = false;
  }
</script>

<div class="editPField">
  {#if editPFlag}
    <textarea
      class="eListName"
      bind:value={name}
      bind:this={editField}
      on:keydown={(e) => {
        if (e.code === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          nameChanged();
        }
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

  .editPField {
    cursor: pointer;
  }
</style>
