<script>
  import { tick } from "svelte";
  import { keyHandler } from "../stores/keyHandler.js";

  let { name = $bindable(), edit, size, editoff } = $props();

  let editField = $state(null);
  let editH2Flag = $state(false);
  let origKeyHandler = null;

  $effect.pre(async () => {
    if (edit) await editName();
  });

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
    editH2Flag = false;
    if (origKeyHandler !== null) {
      $keyHandler = origKeyHandler;
      origKeyHandler = null;
    }
    editoff();
  }
</script>

<div class="editH2Field">
  {#if editH2Flag}
    <input
      class="eListName"
      type="text"
      style="width: {size};"
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
    <h2
      ondblclick={() => {
        editName();
      }}
    >
      {name}
    </h2>
  {/if}
</div>

<style>
  h2 {
    margin: 5px;
  }
  .eListName {
    background-color: rgba(255, 255, 255, 0.3);
    margin: 10px;
    padding: 10px;
    border-radius: 10px;
  }

  .editH2Field {
    cursor: pointer;
    margin: 5px 0px 10px 0px;
  }
</style>
