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
      case "listbgcolor":
        prefs.listbgcolor = value;
        break;
      case "cursorColor":
        prefs.cursorColor = value;
        break;
      case "cursorText":
        prefs.cursorText = value;
        break;
      case "dialogBGColor":
        prefs.dialogBGColor = value;
        break;
      case "dialogTextColor":
        prefs.dialogTextColor = value;
        break;
      case "listtextcolor":
        prefs.listtextcolor = value;
        break;
      default:
        break;
    }
    showPicker = false;
    dispatch("change", prefs);
  }
</script>

{#if prefs !== null}
  <h2>List Preferences</h2>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Cursor Width: </label>
    <div></div>
    <input
      bind:value={prefs.cursorWidth}
      size="20"
      on:change={() => {
        dispatch("change", prefs);
      }}
    />
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> List Background Color:</label>
    <div
      class="circlePicker"
      on:click={(event) => {
        changeColor("listbgcolor", prefs.listbgcolor);
      }}
      style="background-color: {prefs.listbgcolor};"
    />
    <label class="variousPickerLabel2">{prefs.listbgcolor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Cursor Color</label>
    <div
      class="circlePicker"
      on:click={(event) => {
        changeColor("cursorColor", prefs.cursorColor);
      }}
      style="background-color: {prefs.cursorColor};"
    />
    <label class="variousPickerLabel2">{prefs.cursorColor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Cursor Text Color: </label>
    <div
      class="circlePicker"
      on:click={(event) => {
        changeColor("cursorText", prefs.cursorText);
      }}
      style="background-color: {prefs.cursorText};"
    />
    <label class="variousPickerLabel2">{prefs.cursorText}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Dialog Background Color </label>
    <div
      class="circlePicker"
      on:click={(event) => {
        changeColor("dialogBGColor", prefs.dialogBGColor);
      }}
      style="background-color: {prefs.dialogBGColor};"
    />
    <label class="variousPickerLabel2">{prefs.dialogBGColor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Dialog Text Color</label>
    <div
      class="circlePicker"
      on:click={(event) => {
        changeColor("dialogTextColor", prefs.dialogTextColor);
      }}
      style="background-color: {prefs.dialogTextColor};"
    />
    <label class="variousPickerLabel2">{prefs.dialogTextColor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> List Text Color </label>
    <div
      class="circlePicker"
      on:click={(event) => {
        changeColor("listtextcolor", prefs.listtextcolor);
      }}
      style="background-color: {prefs.listtextcolor};"
    />
    <label class="variousPickerLabel2">{prefs.listtextcolor}</label>
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
    margin-top: 10px;
  }
</style>
