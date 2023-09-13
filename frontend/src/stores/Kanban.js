import { writable } from 'svelte/store';

let DefaultKanban = {
    boards: [],
  };

export const Kanban = writable(DefaultKanban);
