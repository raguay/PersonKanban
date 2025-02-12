<script>
  import { onMount } from "svelte";
  import ColorPicker from "svelte-awesome-color-picker";

  let { prefs = $bindable(), onchange } = $props();

  let colorchange = $state("");
  let colorID = $state("");
  let showPicker = $state(false);
  let explanation = $state();

  onMount(() => {
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
      case "itembgcolor":
        prefs.itembgcolor = value;
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
      case "itemtextcolor":
        prefs.itemtextcolor = value;
        break;
      default:
        break;
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_label_has_associated_control -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if prefs !== null}
  <h2>Item Preferences</h2>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Cursor Width: </label>
    <div></div>
    <input
      bind:value={prefs.cursorWidth}
      size="20"
      onchange={() => {
        onchange(prefs);
      }}
    />
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Item Background Color:</label>
    <div
      class="circlePicker"
      onclick={() => {
        changeColor("itembgcolor", prefs.itembgcolor);
      }}
      style="background-color: {prefs.itembgcolor};"
    ></div>
    <label class="variousPickerLabel2">{prefs.itembgcolor}</label>
  </div>
  <div class="colorPicker">
    <label class="variousPickerLabel1"> Cursor Color</label>
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
    <label class="variousPickerLabel1"> Cursor Text Color: </label>
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
    <label class="variousPickerLabel1"> Dialog Background Color </label>
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
    <label class="variousPickerLabel1"> Dialog Text Color</label>
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
    <label class="variousPickerLabel1"> Item Text Color </label>
    <div
      class="circlePicker"
      onclick={() => {
        changeColor("itemtextcolor", prefs.itemtextcolor);
      }}
      style="background-color: {prefs.itemtextcolor};"
    ></div>
    <label class="variousPickerLabel2">{prefs.itemtextcolor}</label>
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
