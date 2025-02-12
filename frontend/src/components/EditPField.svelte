<script>
  import { tick } from "svelte";
  import { keyHandler } from "../stores/keyHandler.js";

  let { name = $bindable(), edit, editoff } = $props();

  let editField = $state(null);
  let editPFlag = $state(false);
  let origKeyHandler = null;

  $effect(() => {
    if (edit) editName();
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
    editPFlag = false;
    editoff();
  }
</script>

<div class="editPField">
  {#if editPFlag}
    <textarea
      class="eListName"
      bind:value={name}
      bind:this={editField}
      onkeydown={(e) => {
        if (e.code === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          nameChanged();
        }
      }}
      onblur={() => {
        nameChanged();
      }}
    />
  {:else}
    <p
      class="pListName"
      ondblclick={() => {
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
