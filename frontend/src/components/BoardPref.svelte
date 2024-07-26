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
      case "selectTabColor":
        prefs.selectTabColor = value;
        break;
      case "unselectTabTextColor":
        prefs.unselectTabTextColor = value;
        break;
      case "selectTabTextColor":
        prefs.selectTabTextColor = value;
        break;
      case "listcontainercolor":
        prefs.listcontainercolor = value;
        break;
      case "dialogBGColor":
        prefs.dialogBGColor = value;
        break;
      case "dialogTextColor":
        prefs.dialogTextColor = value;
        break;
      case "cursorColor":
        prefs.cursorColor = value;
        break;
      case "cursorText":
        prefs.cursorText = value;
        break;
      case "commandbarbgcolor":
        prefs.commandbarbgcolor = value;
        break;
      case "commandbartextcolor":
        prefs.commandbartextcolor = value;
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
    <label class="variousPickerLabel1"> Font: </label>
    <div></div>
    <input
      bind:value={prefs.font}
      size="60"
      on:change={() => {
        dispatch("change", prefs);
      }}
    />
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Font Size: </label>
    <div></div>
    <input
      bind:value={prefs.fontsize}
      size="20"
      on:change={() => {
        dispatch("change", prefs);
      }}
    />
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Unselected Tab</label>
    <div
      class="circlePicker"
      on:click={(event) => {
        changeColor("unselectTabColor", prefs.unselectTabColor);
      }}
      style="background-color: {prefs.unselectTabColor};"
    />
    <label class="variousPickerLabel2">{prefs.unselectTabColor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Selected Tab </label>
    <div
      class="circlePicker"
      on:click={(event) => {
        changeColor("selectTabColor", prefs.selectTabColor);
      }}
      style="background-color: {prefs.selectTabColor};"
    />
    <label class="variousPickerLabel2">{prefs.selectTabColor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Unselected Tab Text</label>
    <div
      class="circlePicker"
      on:click={(event) => {
        changeColor("unselectTabTextColor", prefs.unselectTabTextColor);
      }}
      style="background-color: {prefs.unselectTabTextColor};"
    />
    <label class="variousPickerLabel2">{prefs.unselectTabTextColor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Selected Tab Text</label>
    <div
      class="circlePicker"
      on:click={(event) => {
        changeColor("selectTabTextColor", prefs.selectTabTextColor);
      }}
      style="background-color: {prefs.selectTabTextColor};"
    />
    <label class="variousPickerLabel2">{prefs.selectTabTextColor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> List Container</label>
    <div
      class="circlePicker"
      on:click={(event) => {
        changeColor("listcontainercolor", prefs.listcontainercolor);
      }}
      style="background-color: {prefs.listcontainercolor};"
    />
    <label class="variousPickerLabel2">{prefs.listcontainercolor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Dialog Background</label>
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
    <label class="variousPickerLabel1"> Dialog Text</label>
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
    <label class="variousPickerLabel1"> Cursor</label>
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
    <label class="variousPickerLabel1"> Cursor Text</label>
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
    <label class="variousPickerLabel1"> Commandbar Background</label>
    <div
      class="circlePicker"
      on:click={(event) => {
        changeColor("commandbarbgcolor", prefs.commandbarbgcolor);
      }}
      style="background-color: {prefs.commandbarbgcolor};"
    />
    <label class="variousPickerLabel2">{prefs.commandbarbgcolor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Commandbar Text</label>
    <div
      class="circlePicker"
      on:click={(event) => {
        changeColor("commandbartextcolor", prefs.commandbartextcolor);
      }}
      style="background-color: {prefs.commandbartextcolor};"
    />
    <label class="variousPickerLabel2">{prefs.commandbartextcolor}</label>
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
