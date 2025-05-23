import { writable } from "svelte/store";
import * as App from "../../wailsjs/go/main/App.js";

export const registers = writable({
  regs: [],
  store: async function (key, val) {
    this.regs = this.regs.filter((item) => item.key !== key);
    this.regs.push({
      key: key,
      value: val,
    });
    await this.saveRegisters();
  },
  get: function (key) {
    return this.regs.filter((item) => item.key === key)[0].value;
  },
  saveRegisters: async function () {
    const hdir = await App.GetHomeDir();
    const configdir = await App.AppendPath(hdir, ".config");
    const kbcnfgdir = await App.AppendPath(configdir, "PersonKanban");
    const registerfile = await App.AppendPath(kbcnfgdir, "registers.json");
    await App.WriteFile(registerfile, JSON.stringify(this.regs));
    const err = await App.GetError();
    if (err !== "") console.log("Error: ", err);
  },
  loadRegisters: async function () {
    const hdir = await App.GetHomeDir();
    const configdir = await App.AppendPath(hdir, ".config");
    const kbcnfgdir = await App.AppendPath(configdir, "PersonKanban");
    const registerfile = await App.AppendPath(kbcnfgdir, "registers.json");
    if (await App.FileExists(registerfile)) {
      this.regs = JSON.parse(await App.ReadFile(registerfile));
      const err = await App.GetError();
      if (err !== "") console.log("Error: ", err);
    } else {
      await this.saveRegisters();
    }
  },
});
