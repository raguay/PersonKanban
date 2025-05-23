import { writable } from "svelte/store";

export const registers = writable({
  regs: [],
  save: function (key, val) {
    this.regs[key] = val;
  },
  get: function (key) {
    return this.regs[key];
  },
  saveRegisters: function () {},
  loadRegisters: function () {},
});
