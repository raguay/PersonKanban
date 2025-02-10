import SvelteKanban from './SvelteKanban.svelte';
import { mount } from "svelte";

const app = mount(SvelteKanban, {
  target: document.body,
  props: {
  }
});

export default app;
