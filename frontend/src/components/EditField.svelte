<script>
  import { tick } from "svelte";
  import { keyHandler } from "../stores/keyHandler.js";
  import VimInput from "./VimInput.svelte";

  let {
    name = $bindable(),
    edit = $bindable(),
    editoff = false,
    type = "h2",
  } = $props();

  let origKeyHandler = null;

  $effect.pre(async () => {
    if (edit) await editName();
    if (!edit && $keyHandler === null && origKeyHandler !== null) {
      $keyHandler = origKeyHandler;
      origKeyHandler = null;
      editoff();
    }
  });

  async function editName() {
    edit = true;
    await tick();
    if ($keyHandler !== null) {
      origKeyHandler = $keyHandler;
      $keyHandler = null;
    }
  }

  function nameChanged() {
    edit = false;
    if (origKeyHandler !== null) {
      $keyHandler = origKeyHandler;
      origKeyHandler = null;
    }
    editoff();
  }
</script>

<div class="editField">
  {#if edit}
    <VimInput
      class="eListName"
      bind:value={name}
      short={true}
      bind:show={edit}
      oninput={(val) => {
        name = val;
        nameChanged();
      }}
    />
  {:else if type === "h2"}
    <h2
      ondblclick={() => {
        editName();
      }}
    >
      {name}
    </h2>
  {:else if type === "p"}
    <p
      ondblclick={() => {
        editName();
      }}
    >
      {name}
    </p>
  {/if}
</div>

<style>
  .editField {
    cursor: pointer;
    margin: 0px 10px 10px 0px;
    user-select: none;
    width: 100%;
  }

  .editField p {
    margin: 0px;
  }

  .editField h2 {
    margin: 0px;
  }
</style>
