<script>
  import { tick } from "svelte";
  import { keyHandler } from "../stores/keyHandler.js";
  import VimInput from "./VimInput.svelte";

  let {
    name = $bindable(),
    edit = $bindable(),
    type = "h2",
    onfocusout = () => {},
    oninput = () => {},
    onblur = () => {},
  } = $props();

  $effect.pre(async () => {
    if (edit) await editName();
  });

  async function editName() {
    edit = true;
    $keyHandler = null;
    await tick();
  }

  function nameChanged(val) {
    name = val;
    edit = false;
    oninput(val);
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
        nameChanged(val);
      }}
      {onfocusout}
      {onblur}
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
