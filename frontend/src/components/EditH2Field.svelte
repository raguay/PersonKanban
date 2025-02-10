<!-- @migration-task Error while migrating Svelte code: Can't migrate code with afterUpdate. Please migrate by hand. -->
<script>
  import { createEventDispatcher, afterUpdate, tick } from "svelte";
  import { keyHandler } from "../stores/keyHandler.js";

  export let name = "";
  export let edit = false;
  export let size = "360px";

  let editField;
  let editH2Flag = false;
  let origKeyHandler = null;

  const disbatch = createEventDispatcher();

  afterUpdate(async () => {
    if (edit) await editName();
    edit = false;
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
      style="width: {size};"
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
  }

  .editH2Field {
    cursor: pointer;
    margin: 5px 0px 10px 0px;
  }
</style>
