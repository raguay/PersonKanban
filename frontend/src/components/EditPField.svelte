<div class='editH2Field'>
  {#if editH2Flag}
    <textarea class='eListName'
           bind:value={name}
           bind:this={editField}
           on:keydown={(e) => {if(e.code === 'Enter') nameChanged(); }}
           on:blur={() => { nameChanged(); }}
    />
    {:else}
      <p class='pListName'
        on:dblclick={() => { editName(); }}
      >
        {name}
      </p>
  {/if}
</div>

<style>
  .eListName {
    background-color: rgba(255,255,255,0.3);
    margin: 0px;
    width: 100%;
    padding: 0px;
    border-radius: 10px;
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

