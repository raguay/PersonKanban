import { writable } from 'svelte/store';

//
// This stores the current keyboard handler state. Each state defines a particular 
// handler to use.
//
// State        Use
// ----------------------
//   0          Default
//   1          ItemEdit handler
//   2          QuickBar handler
//   3          Metaboard handler
//   4          Commandbar handler
//   5          List handler
//   6          Preferences handler
//   10         Don't process keys
//
export const kbstate = writable(0);
