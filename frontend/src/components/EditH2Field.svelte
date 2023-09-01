<div class='editH2Field'>
  {#if editH2Flag}
    <input class='eListName'
           type='text'
           bind:value={name}
           bind:this={editField}
           on:keydown={(e) => {if(e.code === 'Enter') nameChanged(); }}
           on:blur={() => { nameChanged(); }}
    />
    {:else}
      <h2
        on:dblclick={() => { editName(); }}
      >
        {name}
      </h2>
  {/if}
</div>

<style>
  .eListname {
    background-color: rgba(255,255,255,0.3);
    margin: 0px;
    padding: 0px;
    border-radius: 10px;
  }

  .editH2Field {
    cursor: pointer;
  }

  .editH2Field {
    margin: 5px 0px 10px 0px;
  }

  .editH2Field input {
    width: 165px;
  }
</style>

<script>
  import { createEventDispatcher, tick } from 'svelte';
  
  export let name;
  export let styles;

  let editField;
  let editH2Flag = false;

  const disbatch = createEventDispatcher();

  async function editName() {
    editH2Flag = true;
    await tick();
    editField.focus();
  }

  function nameChanged() {
    disbatch('nameChanged', {
      name: editField.value
    });
    editH2Flag = false;
  }
</script>

