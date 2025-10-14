<script>
  import { onMount } from "svelte";
  import VimInput from "../components/VimInput.svelte";
  import { preferences } from "../stores/preferences.js";

  let { prefs = $bindable(), onchange } = $props();
  let original = {};

  onMount(() => {
    //
    // Make a copy of the preferences.
    //
    original = $preferences;

    return () => {
      //
      // Tell Preferences has been changed.
      //
      onchange(prefs);
    };
  });
</script>

<div id="system">
  <h1>System Preferences</h1>
  <form>
    <label for="dateformat">Date Format:</label>
    <VimInput
      bind:value={$preferences.dateformat}
      show={true}
      short={true}
      setFocus={true}
    />
    <br />
    <label for="timeformat">Time Format:</label>
    <VimInput
      bind:value={$preferences.timeformat}
      show={true}
      short={true}
      setFocus={false}
    />
  </form>
</div>

<style>
  #system {
    display: flex;
    flex-direction: column;
  }
  form {
    display: flex;
    flex-direction: column;
  }
</style>
