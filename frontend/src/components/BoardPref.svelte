<script>
  import { onMount } from "svelte";
  import ColorPicker from "./ColorPicker.svelte";
  import { boardCursor } from "../stores/boardCursor.js";
  import { Kanban } from "../stores/Kanban.js";

  export let prefs;

  let colorchange = "";
  let colorID = 0;
  let showPicker = false;
  let pickerType = "";
  let explanation;

  onMount(() => {});

  function changeColor(id, value) {
    colorID = id;
    explanation = id;
    colorchange = value;
    showPicker = true;
  }
  function setColor(id, value) {
    switch (id) {
      case "backgroundcolor":
        prefs.backgroundcolor = value;
        break;
      default:
        break;
    }
    showPicker = false;
  }
</script>

<h2>Board Preferences</h2>
<label class="variousPickerLabel1"> backgroundcolor </label>
<div
  class="circlePicker"
  on:click={(event) => {
    changeColor("backgroundcolor", prefs.backgroundcolor);
  }}
  style="background-color: {prefs.backgroundcolor};"
/>
<label class="variousPickerLabel2">{prefs.backgroundcolor}</label>

{#if prefs !== undefined}
  <ColorPicker
    item={pickerType}
    explainText={explanation}
    color={colorchange}
    id={colorID}
    show={showPicker}
    theme={prefs}
    on:colorChanged={(event) => {
      setColor(event.detail.data.id, event.detail.data.color);
    }}
    on:quitColorPicker={(event) => {
      showPicker = false;
    }}
  />
{/if}

<style>
  h2 {
    text-align: center;
  }

  .variousPickerLabel1 {
    font-size: 25px;
    margin: 0px 10px 0px 10px;
    grid-column: 1;
    text-align: right;
  }

  .variousPickerLabel2 {
    font-size: 25px;
    margin: 0px 10px 0px 10px;
    user-select: text;
    grid-column: 3;
  }

  .circlePicker {
    height: 30px;
    min-height: 30px;
    width: 30px;
    min-width: 30px;
    border-radius: 30px;
    cursor: pointer;
    border: solid 1px white;
    grid-column: 2;
  }
</style>
