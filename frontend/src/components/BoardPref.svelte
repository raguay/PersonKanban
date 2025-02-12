<script>
  import { onMount } from "svelte";
  import ColorPicker from "svelte-awesome-color-picker";

  let { prefs, onchange } = $props();

  let colorchange = $state("");
  let colorID = $state("");
  let showPicker = $state(false);
  let explanation = $state("");

  onMount(() => {
    //
    // Have it update the preferences when removed.
    //
    return () => {
      onchange(prefs);
    };
  });

  function changeColor(id, value) {
    colorID = id;
    explanation = id;
    colorchange = value;
    showPicker = !showPicker;
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
      onchange={() => {
        onchange(prefs);
      }}
    />
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Font Size: </label>
    <div></div>
    <input
      bind:value={prefs.fontsize}
      size="20"
      onchange={() => {
        onchange(prefs);
      }}
    />
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Unselected Tab</label>
    <div
      class="circlePicker"
      onclick={() => {
        changeColor("unselectTabColor", prefs.unselectTabColor);
      }}
      style="background-color: {prefs.unselectTabColor};"
    ></div>
    <label class="variousPickerLabel2">{prefs.unselectTabColor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Selected Tab </label>
    <div
      class="circlePicker"
      onclick={() => {
        changeColor("selectTabColor", prefs.selectTabColor);
      }}
      style="background-color: {prefs.selectTabColor};"
    ></div>
    <label class="variousPickerLabel2">{prefs.selectTabColor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Unselected Tab Text</label>
    <div
      class="circlePicker"
      onclick={() => {
        changeColor("unselectTabTextColor", prefs.unselectTabTextColor);
      }}
      style="background-color: {prefs.unselectTabTextColor};"
    ></div>
    <label class="variousPickerLabel2">{prefs.unselectTabTextColor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Selected Tab Text</label>
    <div
      class="circlePicker"
      onclick={() => {
        changeColor("selectTabTextColor", prefs.selectTabTextColor);
      }}
      style="background-color: {prefs.selectTabTextColor};"
    ></div>
    <label class="variousPickerLabel2">{prefs.selectTabTextColor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> List Container</label>
    <div
      class="circlePicker"
      onclick={() => {
        changeColor("listcontainercolor", prefs.listcontainercolor);
      }}
      style="background-color: {prefs.listcontainercolor};"
    ></div>
    <label class="variousPickerLabel2">{prefs.listcontainercolor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Dialog Background</label>
    <div
      class="circlePicker"
      onclick={() => {
        changeColor("dialogBGColor", prefs.dialogBGColor);
      }}
      style="background-color: {prefs.dialogBGColor};"
    ></div>
    <label class="variousPickerLabel2">{prefs.dialogBGColor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Dialog Text</label>
    <div
      class="circlePicker"
      onclick={() => {
        changeColor("dialogTextColor", prefs.dialogTextColor);
      }}
      style="background-color: {prefs.dialogTextColor};"
    ></div>
    <label class="variousPickerLabel2">{prefs.dialogTextColor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Cursor</label>
    <div
      class="circlePicker"
      onclick={() => {
        changeColor("cursorColor", prefs.cursorColor);
      }}
      style="background-color: {prefs.cursorColor};"
    ></div>
    <label class="variousPickerLabel2">{prefs.cursorColor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Cursor Text</label>
    <div
      class="circlePicker"
      onclick={() => {
        changeColor("cursorText", prefs.cursorText);
      }}
      style="background-color: {prefs.cursorText};"
    ></div>
    <label class="variousPickerLabel2">{prefs.cursorText}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Commandbar Background</label>
    <div
      class="circlePicker"
      onclick={() => {
        changeColor("commandbarbgcolor", prefs.commandbarbgcolor);
      }}
      style="background-color: {prefs.commandbarbgcolor};"
    ></div>
    <label class="variousPickerLabel2">{prefs.commandbarbgcolor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Commandbar Text</label>
    <div
      class="circlePicker"
      onclick={() => {
        changeColor("commandbartextcolor", prefs.commandbartextcolor);
      }}
      style="background-color: {prefs.commandbartextcolor};"
    ></div>
    <label class="variousPickerLabel2">{prefs.commandbartextcolor}</label>
  </div>

  {#if showPicker}
    <div
      style="position: absolute; top: 20%; left: 60%; display: flex; z-index: 100;"
    >
      <ColorPicker
        hex={colorchange}
        {explanation}
        bind:isOpen={showPicker}
        isPopup={false}
        isDialog={false}
        position="responsive"
        onInput={(color) => {
          console.log("colorpicker: ", color.hex);
          setColor(colorID, color.hex);
        }}
      />
    </div>
  {/if}
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
