<script>
  import { tick, onMount } from "svelte";

  let basetheme = {
    modes: [
      {
        name: "normal",
        color: "blue",
        text: "white",
      },
      {
        name: "insert",
        color: "yellow",
        text: "black",
      },
      {
        name: "visual",
        color: "green",
        text: "purple",
      },
    ],
  };
  let {
    value = $bindable(),
    oneline = true,
    oninput,
    style,
    setFocus = true,
    focus = $bindable(),
    theme = basetheme,
    show = $bindable(),
    short = false,
    onfocusin = () => {},
    onfocusout = () => {},
    onblur = () => {},
    actions = [],
  } = $props();

  let inp = $state(null);
  let mode = $state("insert");
  let pos = $state(value !== null ? value.length : 0);
  let posvb = $state(0);
  let keystate = $state(0);
  let accu = "";
  let commandToRun = null;
  let vimCommand = {
    insertEndCmd,
    backwardsCharCmd,
    forwardCharCmd,
    replaceCharCmd,
    gotoBeginingCmd,
    gotoEndCmd,
    backwardsWordCmd,
    forwardWordCmd,
    deleteCharCmd,
    lastWord,
    nextWord,
    createSelection,
    moveCursorTo,
    getValue,
    setValue,
    getPos,
    setPos,
  };
  let savedKey = "";

  onMount(async () => {
    //
    //
    // Setup the focus function.
    //
    focus = inpFocus;

    //
    // Wait for the elements to be added.
    //
    do {
      await tick();
    } while (inp === null);

    //
    // Focus the input.
    //
    inpFocus();
  });

  function inpFocus() {
    if (inp !== null) {
      if (setFocus) {
        inp.focus();
      } else {
        inp.blur();
      }
    }
  }

  function getModeColor() {
    return theme.modes.find((nm) => nm.name === mode).color;
  }

  function getModeTextColor() {
    return theme.modes.find((nm) => nm.name === mode).text;
  }

  function sendValue() {
    oninput(value);
  }

  function moveCursorTo(loc) {
    if (inp !== null) inp.setSelectionRange(loc, loc);
  }

  function removeChar() {
    //
    // This will remove a single character at the cursor and set the position back one if
    // there isn't a selection. If there is a selection, remove the selection
    // and back up the position based on the number of characters deleted.
    //
    let seltextlength = inp.selectionStart - inp.selectionEnd;
    if (seltextlength === 0) {
//
      // No selection. Just remove the character at the cursor.
      //
      value = value.slice(0, pos - 1) + value.slice(pos);
      pos = pos - 1;
    } else {
      //
      // There is a selection. Remove it and back up the cursor.
      //
      value =
        value.slice(0, inp.selectionStart) + value.slice(inp.selectionEnd);
      pos = inp.selectionStart;
    }
  }

  function createSelection(field, start, end) {
    if (field.createTextRange) {
      let selRange = field.createTextRange();
      selRange.collapse(true);
      selRange.moveStart("character", start);
      selRange.moveEnd("character", end - start);
      selRange.select();
    } else if (field.setSelectionRange) {
      field.setSelectionRange(start, end);
    } else if (field.selectionStart) {
      field.selectionStart = start;
      field.selectionEnd = end;
    }
    field.focus();
  }

  function nextWord() {
    while (pos < value.length && value[pos] === " ") pos++;
    while (pos < value.length && value[pos] !== " ") pos++;
    while (pos < value.length && value[pos] === " ") pos++;
  }

  function lastWord() {
    while (pos > 0 && value[pos] === " ") pos--;
    while (pos > 0 && value[pos] !== " ") pos--;
    while (pos > 0 && value[pos] === " ") pos--;
    while (pos < value.length && value[pos] === " ") pos++;
  }

async function deleteCharCmd(vimCmd, nchar) {
    removeChar();
    await tick();
    moveCursorTo(pos);
  }

  async function forwardWordCmd(vimCmd, nchar) {
    nextWord();
    await tick();
    moveCursorTo(pos);
  }
  
  async function backwardsWordCmd(vimCmd, nchar) {
    lastWord();
    await tick();
    moveCursorTo(pos);
  }

  async function gotoEndCmd(vimCmd, nchr) {
    pos = value.length;
    moveCursorTo(pos);
  }

  async function gotoBeginingCmd(vimCmd, nchr) {
    pos = 0;
    moveCursorTo(pos);
  }

  async function replaceCharCmd(vimCmd, nchr) {
    removeChar();
    await tick();
    moveCursorTo(pos);
    mode = "insert";
    accu = "";
  }

  async function forwardCharCmd(vimCmd, nchr) {
    pos++;
    if (pos > value.length) pos = value.length;
    moveCursorTo(pos);
  }

  async function backwardsCharCmd(vimCmd, nchr) {
    pos--;
    if (pos < 0) pos = 0;
    moveCursorTo(pos);
  }

  async function insertEndCmd(vimCmd, nchr) {
    pos = value.length;
    moveCursorTo(pos);
    mode = "insert";
  }

  function getValue() {
    return(value);
  }

  function setValue(val) {
    value = val;
  }

  function getPos() {
    return(pos);
  }

  function setPos(newPos) {
    pos = newPos;
  }
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events, a11y_no_static_element_interactions -->
{#if theme !== null}
  <div
    id="container"
    onmouseover={() => {
      inpFocus();
    }}
    style="flex-direction: {oneline ? 'row' : 'column'}; {style}"
  >
    {#if oneline}
      <span
        id="mode"
        style="border-radius: 5px 0px 0px 5px; font-family: monospace; background-color: {getModeColor()}; color: {getModeTextColor()}; border: 0px solid {getModeColor()};"
      >
        {#if short}
          {mode[0]}
        {:else}
          {mode}
        {/if}
      </span>
    {/if}
    <input
      bind:this={inp}
      bind:value
      {style}
      {onfocusin}
      {onfocusout}
      onblur={() => {
        show = false;
        onblur();
      }}
      onkeydown={async (e) => {
        switch (mode) {
          case "insert":
            switch (e.key) {
              case "Enter":
                e.preventDefault();
                e.stopPropagation();
                sendValue();
                break;
              case "Escape":
                e.preventDefault();
                e.stopPropagation();
                mode = "normal";
                break;
              case "Backspace":
              case "ArrowLeft":
                pos--;
                if (pos < 0) pos = 0;
                break;
              case "Delete":
                pos--;
                if (pos < 0) pos = 0;
                break;
              case "ArrowRight":
                pos++;
                if (pos > value.length) pos = value.length;
                break;
              case "ArrowUp":
              case "ArrowDown":
                break;
              default:
                //
                // Add to the number of characters added. TODO: fix. Very very bad logic, but it works.
                //
                pos++;
                break;
            }
            break;

          case "normal":
            e.preventDefault();
            e.stopPropagation();
            switch (keystate) {
              case 0:
                switch (e.key) {
                  case "x":
                    commandToRun = deleteCharCmd;
                    break;
                  case "w":
                    //
                    // Forward to next word (after space)
                    //
                    commandToRun = forwardWordCmd;
                    break;
                  case "b":
                    //
                    // Backwards to previous word (after space)
                    //
                    commandToRun = backwardsWordCmd;
                    break;
                  case "Enter":
                    sendValue();
                    accu = "";
                    commandToRun = null;
                    break;
                  case "Escape":
                    accu = "";
                    commandToRun = null;
                    show = false;
                    onblur();
                    break;
                  case "v":
                    mode = "visual";
                    posvb = pos;
                    accu = "";
                    commandToRun = null;
                    break;
                  case "i":
                    accu = "";
                    commandToRun = null;
                    mode = "insert";
                    break;
                  case "G":
                  case "$":
                    commandToRun = gotoEndCmd;
                    break;
                  case "g":
                  case "0":
                  case "^":
                    commandToRun = gotoBeginingCmd;
                    break;
                  case "r":
                    commandToRun = replaceCharCmd;
                    break;
                  case "h":
                    commandToRun = backwardsCharCmd;
                    break;
                  case "l":
                    commandToRun = forwardCharCmd;
                    break;
                  case "A":
                    commandToRun = insertEndCmd;
                    break;
                  case "0":
                  case "1":
                  case "2":
                  case "3":
                  case "4":
                  case "5":
                  case "6":
                  case "7":
                  case "8":
                  case "9":
                    accu += e.key;
                    break;
                  default:
                    //
                    // See if an action passed is being executed.
                    //
                    if (actions.length > 0) {
                      for (let i = 0; i < actions.length; i++) {
                        if (e.key === actions[i].key) {
                          //
                          // This action was selected. Run it.
                          //
                          commandToRun = actions[i].command;
                          keystate = actions[i].keystate;
                        }
                      }
                    }
                    break;
                }
                break;
              case 1:
                //
                // Save the key for giving to the command.
                //
                keystate = 0;
                savedKey = e.key;
                break;
            }
            if (keystate === 0) {
              //
              // Run the command the number of times asked for.
              //
              if (commandToRun !== null) {
                let runNum = 1;
                if (accu.length > 0) runNum = parseInt(accu);
                do {
                  await commandToRun(vimCommand, savedKey);
                  runNum--;
                } while (runNum > 0);
                commandToRun = null;
                accu = "";
              }
            }
            break;

          case "visual":
            e.preventDefault();
            e.stopPropagation();
            switch (e.key) {
              case "Escape":
                mode = "normal";
                break;
              case "h":
                if (inp !== null) {
                  pos = pos - 1;
                  if (pos < 0) pos = 0;
                  // Select a portion of text
                  if (posvb >= pos) createSelection(inp, pos, posvb);
                  else createSelection(inp, posvb, pos);
                }
                break;
              case "l":
                if (inp !== null) {
                  pos = pos + 1;
                  if (pos > value.length) pos = value.length;
                  // Select a portion of text
                  if (posvb >= pos) createSelection(inp, pos, posvb);
                  else createSelection(inp, posvb, pos);
                }
                break;
              case "G":
              case "$":
                pos = value.length;
                if (posvb >= pos) createSelection(inp, pos, posvb);
                else createSelection(inp, posvb, pos);
                break;
              case "g":
              case "0":
              case "^":
                pos = 0;
                if (posvb >= pos) createSelection(inp, pos, posvb);
                else createSelection(inp, posvb, pos);
                break;
              case "x":
                removeChar();
                await tick();
                moveCursorTo(pos);
                break;
              case "g":
              case "0":
              case "^":
                pos = 0;
                if (posvb >= pos) createSelection(inp, pos, posvb);
                else createSelection(inp, posvb, pos);
                break;
              case "x":
                removeChar();
                await tick();
                moveCursorTo(pos);
                mode = "normal";
              case "g":
              case "0":
              case "^":
                pos = 0;
                if (posvb >= pos) createSelection(inp, pos, posvb);
                else createSelection(inp, posvb, pos);
                break;
              case "x":
                removeChar();
                await tick();
                moveCursorTo(pos);
                mode = "normal";
                break;
              case "0":
              case "^":
                pos = 0;
                if (posvb >= pos) createSelection(inp, pos, posvb);
                else createSelection(inp, posvb, pos);
                break;
              case "x":
                removeChar();
                await tick();
                moveCursorTo(pos);
                mode = "normal";
                break;
            }
            break;
        }
      }}
    />
    {#if !oneline}
      <div id="inforow">
        <span
          id="mode"
          style="border-radius: 0px 0px 5px 5px; font-family: monospace; background-color: {getModeColor()}; color: {getModeTextColor()}; border: 0px solid {getModeColor()}"
        >
          {#if short}
            {mode[0]}
          {:else}
            {mode}
          {/if}
        </span>
        <span id="position">position: {pos}</span>
      </div>
    {/if}
  </div>
{/if}

<style>
  #container {
    display: flex;
    user-select: none;
    border-radius: 5px;
    margin: 0px;
    padding: 0px;
  }

  #container input {
    width: 100%;
    border: 0px;
    outline: none;
    margin: 0px;
    padding: 0px 0px 0px 5px;
    border-radius: 0px 5px 5px 0px;
  }

  #container input:focus {
    outline: none;
  }

  #inforow {
    display: flex;
    flex-direction: row;
    user-select: none;
    margin: 0px;
    padding: 0px;
  }

  #mode {
    user-select: none;
    padding: 3px 5px 5px 5px;
    margin: 0px;
  }

  #position {
    border-radius: 0px 0px 5px 5px;
    user-select: none;
    padding: 3px 5px 5px 5px;
    margin: 0px 0px 0px auto;
  }
</style>
