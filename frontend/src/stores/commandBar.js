import { writable } from 'svelte/store';

export const commandBar = writable({
  showing: false,
  commands: [],
  setShowing: function() {this.showing = true},
  clearShowing: function() {this.showing = false},
  toggleShowing: function() {this.showing = !this.showing},
  addCommand: function(name, cmd, desc, destype) {
    //
    // If the command parameters are valid, save the new command.
    //
    if(typeof cmd !== 'undefined' && typeof cmd !== 'string' && typeof name !== "undefined" && name !== null && name !== "") {
      // 
      // Make sure the destype is properly set. 
      //
      if(typeof destype === 'undefined' || destype == null || destype == "") destype = "text";
      this.commands.push({
        command: cmd,
        name: name,
        description: desc,
        type: destype
      });
    }
  },
  getCommand: function(name) {
    // 
    // This function returns the command that matches the name.
    //
    const cmdlist = this.commands.filter(item => item.name === name);
    let result = null;
    if(cmdlist.length > 0) {
      //
      // Found the command. Return it.
      //
      result = cmdlist[0];
    } 
    return(result);
  },
  removeCommand: function(name) {
    // 
    // This will remove the command given.
    //
    this.commands = this.commands.filter(item => item.name !== name);
  }
});
