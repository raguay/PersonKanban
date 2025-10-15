<script>
  import { onMount } from "svelte";
  import VimInput from "../components/VimInput.svelte";
  import { preferences } from "../stores/preferences.js";

  let dateformat = "";
  let timeformat = "";

  onMount(() => {
    //
    // Make a copy of the preferences.
    //
    dateformat = $preferences.prefs.dateformat;
    timeformat = $preferences.prefs.timeformat;

    return async () => {
      //
      // Tell Preferences has been changed.
      //
      $preferences.prefs.dateformat = dateformat;
      $preferences.prefs.timeformat = timeformat;

      await $preferences.SavePrefs();
    };
  });
</script>

<div id="system">
  <h1>System Preferences</h1>
  <form>
    <label for="dateformat">Date Format:</label>
    <VimInput
      bind:value={dateformat}
      show={true}
      short={true}
      setFocus={true}
      onblur={() => {}}
      onfocusin={() => {}}
      onfocusout={() => {}}
    />
    <br />
    <label for="timeformat">Time Format:</label>
    <VimInput
      bind:value={timeformat}
      show={true}
      short={true}
      setFocus={false}
      onblur={() => {}}
      onfocusin={() => {}}
      onfocusout={() => {}}
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
  label {
    margin-bottom: 10px;
  }
</style>
