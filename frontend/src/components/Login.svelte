<div id='login' style="background-color: {styles.backgroundcolor}; 
                       color: {styles.textcolor}; 
                       border-color: {styles.bordercolor};">
  <h2>Login</h2>
  <div class='loginItem'>
    <label for="name">Name:</label>
    <input id="name" name="name" type="text" minlength="4" bind:this={name} on:focus={(e) => { error = "";}} />
  </div>
  <div class='loginItem'>
    <label for="passwd">Password:</label>
    <input  id="passwd" name="passwd" 
            type="password" 
            minlength="8" 
            bind:this={passwd} 
            on:keydown={event => {if(event.code === 'Enter') login();}} 
            on:focus={(e) => { error = "";}} />
  </div>
  <div class='loginItem' style="margin: auto;">
    <button on:click={login}>Submit</button>
  </div>
  {#if error !== null}
    <p style="color: red;">{error}</p>
  {/if}
</div>

<style>
  #login {
    display: flex;
    flex-direction: column;
    padding: 10px;
    margin: auto;
    border: 3px solid;
    border-radius: 5px;
  }

  .loginItem {
    display: inline;
    padding: 0px;
    margin: 5px;
  }

  .loginItem label {
    display: inline;
  }

  h2 {
    font-size: 24px;
    text-align: center;
    margin: 5px auto 20px auto;
  }
</style>

<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let styles;

  let name;
  let passwd;
  let error = null;
  
  function login() {
    var loginable = false;
    
    if(!loginable) {
      //
      // Tell the user the information is incorrect.
      //
      error = "Sorry, these login details are incorrect.";
    }
  }
</script>

