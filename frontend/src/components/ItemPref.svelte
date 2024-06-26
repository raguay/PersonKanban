<script>
  import { onMount, tick } from "svelte";
  import { boardCursor } from "../stores/boardCursor.js";
  import { listCursor } from "../stores/listCursor.js";
  import { itemCursor } from "../stores/itemCursor.js";
  import { preferences } from "../stores/preferences.js";
  import { Kanban } from "../stores/Kanban.js";
</script>

<h2>Item Preferences</h2>

<style>
  h2 {
    text-align: center;
  }
</style>
