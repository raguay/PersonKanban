import { writable } from 'svelte/store';

export const copyBuffer = writable({
  type: "board",
  pref: {},
}
);
