<script>
  import { onMount, createEventDispatcher } from "svelte";
  import ColorPicker from "./ColorPicker.svelte";

  const dispatch = createEventDispatcher();

  export let prefs;

  let colorchange = "";
  let colorID = 0;
  let showPicker = false;
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
      case "unselectTabColor":
        prefs.unselectTabColor = value;
        break;
      default:
        break;
    }
    showPicker = false;
    dispatch("change", prefs);
  }
</script>

{#if prefs !== null}
  <h2>Board Preferences</h2>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> unselectTabColor </label>
    <div
      class="circlePicker"
      on:click={(event) => {
        changeColor("unselectTabColor", prefs.unselectTabColor);
      }}
      style="background-color: {prefs.unselectTabColor};"
    />
    <label class="variousPickerLabel2">{prefs.unselectTabColor}</label>
  </div>
  <ColorPicker
    explainText={explanation}
    color={colorchange}
    id={colorID}
    show={showPicker}
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

  .colorPicker {
    display: grid;
    grid-auto-flow: row dense;
    grid-template-columns: 400px 40px 80px;
    grid-column-gap: 10px;
    grid-row-gap: 20px;
    margin-left: 10px;
  }
</style>
