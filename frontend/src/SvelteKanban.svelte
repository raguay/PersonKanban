<script>
  import { onMount } from "svelte";
  import Board from "./components/Board.svelte";
  import Login from "./components/Login.svelte";
  import UserList from "./components/UserList.svelte";

  let Kanban = {
    user: {},
    boards: [
      {
        name: "New Board",
        lists: [],
      },
    ],
  };
  let defaultStyles = {
    backgroundcolor: "blue",
    textcolor: "white",
    unselectTabColor: "lightgray",
    unselectTabTextColor: "black",
    selectTabColor: "lightblue",
    selectTabTextColor: "black",
    mainboardcolor: "lightblue",
    listcontainercolor: "lightblue",
    listbgcolor: "#9AC2FA",
    listtextcolor: "white",
    itembgcolor: "white",
    itemtextcolor: "black",
    font: '"Fira Code"',
    dialogBGColor: "lightblue",
    dialogTextColor: "black",
    kanbanInfo: "black",
  };
  let styles = defaultStyles;
  let login = true;
  let currentUserData = {
    ID: 0,
    name: "Richard Guay",
    login: "raguay@customct.com",
    passwd: "ragjesus",
    status: "admin",
  };
  let showUserList = false;
  let updateCount = 0;

  onMount(() => {
    //
    // This should be loaded from the server when a user is logged in.
    //
    Kanban = {
      boards: [
        {
          id: 0,
          name: "Job One",
          lists: [
            {
              id: 1000,
              name: "Inbox",
              items: [
                {
                  id: 1001,
                  name: "Test",
                  description: "This is a test item.",
                  color: ["blue"],
                  notes: [
                    {
                      date: "01/01/2020",
                      owner: "Richard Guay",
                      type: "text",
                      info: "This is a test message.",
                    },
                  ],
                  apps: [],
                },
              ],
            },
            {
              id: 2000,
              name: "Working",
              items: [
                {
                  id: 2001,
                  name: "Test",
                  description: "This is a test item.",
                  color: ["blue"],
                  notes: [],
                  apps: [],
                },
              ],
            },
            {
              id: 3000,
              name: "Done",
              items: [
                {
                  id: 3001,
                  name: "Test",
                  description: "This is a test item.",
                  color: ["blue"],
                  notes: [],
                  apps: [],
                },
              ],
            },
          ],
        },
        {
          id: 1,
          name: "Job Two",
          lists: [
            {
              id: 1000,
              name: "Inbox",
              items: [
                {
                  id: 1001,
                  name: "Test",
                  description: "This is a test item.",
                  color: ["blue"],
                  notes: [],
                  apps: [],
                },
              ],
            },
          ],
        },
      ],
      user: {
        ID: 0,
        name: "Richard Guay",
        login: "raguay@customct.com",
        passwd: "ragjesus",
        status: "admin",
      },
    };

    styles = {
      backgroundcolor: "blue",
      textcolor: "white",
      unselectTabColor: "lightgray",
      unselectTabTextColor: "black",
      selectTabColor: "lightblue",
      selectTabTextColor: "black",
      mainboardcolor: "lightblue",
      listcontainercolor: "lightblue",
      listbgcolor: "#9AC2FA",
      listtextcolor: "white",
      itembgcolor: "white",
      itemtextcolor: "black",
      font: '"Fira Code"',
      dialogBGColor: "lightblue",
      dialogTextColor: "black",
      kanbanInfo: "black",
    };
  });

  function acceptLogin(data) {
    currentUserData = data.detail.userdata;
    styles = data.detail.styles;
    login = true;
  }

  function addBoard() {
    var newID = 0;
    Kanban.boards.forEach((item) => {
      if (item.id > newID) newID = item.id;
    });
    Kanban.boards.push({
      id: newID + 1,
      name: "New Board",
      lists: [],
    });
    Kanban = Kanban;
  }

  function addList(e) {
    var newID = 0;
    Kanban.boards.map((board) => {
      if (e.detail.board === board.id) {
        board.lists.forEach((item) => {
          if (item.id > newID) newID = item.id;
        });
      }
    });
    newID = (newID / 1000 + 1) * 1000;
    Kanban.boards = Kanban.boards.map((board) => {
      if (e.detail.board === board.id) {
        board.lists.push({
          id: newID,
          name: "New List",
          items: [],
        });
      }
      return board;
    });
    Kanban = Kanban;
    updateCount = updateCount + 1;
  }

  function addItem(e) {
    var newID = 0;
    Kanban.boards.map((board) => {
      if (e.detail.board === board.id) {
        board.lists.map((list) => {
          if (e.detail.list === list.id) {
            list.items.forEach((item) => {
              if (item.id > newID) newID = item.id;
            });
          }
        });
      }
    });
    Kanban.boards = Kanban.boards.map((board) => {
      if (e.detail.board === board.id) {
        board.lists = board.lists.map((list) => {
          if (e.detail.list == list.id) {
            list.items.push({
              id: newID + 1,
              name: "New Item",
              description: "",
              color: [],
              notes: [],
              apps: [],
            });
          }
          return list;
        });
      }
      return board;
    });
    window.Kanban = Kanban;
    updateCount = updateCount + 1;
  }

  function deleteList(e) {
    Kanban.boards.map((board) => {
      if (e.detail.board === board.id) {
        board.lists = board.lists.filter((list) => e.detail.list !== list.id);
      }
    });
    Kanban = Kanban;
    updateCount = updateCount + 1;
  }

  function deleteItem(e) {
    Kanban.boards.map((board) => {
      if (e.detail.board === board.id) {
        board.lists.map((list) => {
          if (e.detail.list === list.id) {
            list.items = list.items.filter((item) => e.detail.item !== item.id);
          }
        });
      }
    });
    Kanban = Kanban;
    updateCount = updateCount + 1;
  }

  function newItemMsg(e) {
    Kanban.boards.map((board) => {
      if (e.detail.board === board.id) {
        board.lists.map((list) => {
          if (e.detail.list === list.id) {
            list.items.map((item) => {
              if (item.id === e.detail.item) {
                var nwnotes = [];
                nwnotes.push(e.detail.msg);
                item.notes.forEach((note) => nwnotes.push(note));
                item.notes = nwnotes;
              }
            });
          }
        });
      }
    });
    Kanban = Kanban;
    updateCount = updateCount + 1;
  }

  function newItemApp(e) {
    Kanban.boards.map((board) => {
      if (e.detail.board === board.id) {
        board.lists.map((list) => {
          if (e.detail.list === list.id) {
            list.items.map((item) => {
              if (item.id === e.detail.item) {
                item.apps.push(e.detail.app);
              }
            });
          }
        });
      }
    });
    Kanban = Kanban;
    updateCount = updateCount + 1;
  }

  function appUpdate(e) {
    Kanban.boards.map((board) => {
      if (e.detail.board === board.id) {
        board.lists.map((list) => {
          if (e.detail.list === list.id) {
            list.items.map((item) => {
              if (item.id === e.detail.item) {
                item.apps.map((app) => {
                  if (app.id === e.detail.app.id) {
                    app = e.detail.app;
                  }
                });
              }
            });
          }
        });
      }
    });
    Kanban = Kanban;
    updateCount = updateCount + 1;
  }

  function listUpdate(e) {
    Kanban.boards.map((board) => {
      if (e.detail.board === board.id) {
        board.lists.map((list) => {
          if (e.detail.list.id == list.id) {
            list = e.detail.list;
          }
        });
      }
    });
    Kanban = Kanban;
    updateCount = updateCount + 1;
  }
</script>

<div
  id="main"
  style="background-color: {styles.backgroundcolor}; 
                      color: {styles.textcolor};
                      font-family: {styles.font};"
>
  {#if login}
    <div id="Header">
      <h1>ScriptPad Kanban Board</h1>
      <h2>{currentUserData.name}, welcome back!</h2>
    </div>
    {#if showUserList}
      <UserList styles={defaultStyles} />
    {:else}
      <Board
        boardInfo={Kanban.boards}
        {styles}
        update={updateCount}
        user={currentUserData}
        on:addboard={() => {
          addBoard();
        }}
        on:addlist={(e) => {
          addList(e);
        }}
        on:additem={(e) => {
          addItem(e);
        }}
        on:deleteList={(e) => {
          deleteList(e);
        }}
        on:deleteItem={deleteItem}
        on:newItemMsg={newItemMsg}
        on:newItemApp={newItemApp}
        on:appUpdate={appUpdate}
        on:listUpdate={listUpdate}
      />
    {/if}
  {:else}
    <h1>Person Kanban Board from ScriptPad</h1>
    <Login styles={defaultStyles} on:loginAccepted={acceptLogin} />
  {/if}
</div>

<style>
  #main {
    position: absolute;
    top: 0px;
    left: 0px;
    display: flex;
    flex-direction: column;
    flex: 1fr;
    text-align: left;
    padding: 0px;
    margin: 0px;
    user-select: none;
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
  }

  #Header {
    display: flex;
    flex-direction: row;
    text-align: left;
    flex: 1fr;
  }

  #Header h1 {
    margin: 10px;
  }

  #Header h2 {
    margin: 20px 10px 10px auto;
  }

  :global(h1) {
    font-size: 24px !important;
    text-align: center;
  }
</style>
