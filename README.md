![PersonKanban](https://socialify.git.ci/raguay/PersonKanban/image?description=1&font=Source%20Code%20Pro&forks=1&issues=1&language=1&owner=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Dark)
[![Richard's GitHub stats](https://github-readme-stats.vercel.app/api?username=raguay)](https://github.com/anuraghazra/github-readme-stats)
# PersonKanban

A lightweight personal Kanban board for everyday use.

It is currently a working Alpha project with many of the planned features in place. I am currently using it daily to track my projects and bugs. It is a complete keyboard program without any drag & drop features. The keyboard hotkeys work similarly to NeoVim and Vim modal systems. But, in the Personal Kanban program, the cursor (highlighted lists or items and tabs for the boards) control the action of each key.

# How to Build
It is built using [Wails 2](wails.io) and [Go](golang.org). Once they are installed on your system, you can run it using:

```sh
wails dev
```

To run the developmental environment. To make a full binary build, you need to run:

```sh
wails build
```

Just remember, this is alpha quality software at the moment. Use at your own risk.

# Hot Keys
The following are the keyboard assignments and what they do for each mode:

| Key   | Just board selected                                    | List is highlighted                                    | Item in a list is highlighted                                                        |
| :---: | :----------------------------------------------------: | :----------------------------------------------------: | :----------------------------------------------------------------------------------: |
|   a   |                  Creates a new board                   |        Creates a new list in the current board         |                        Creates a new Item in the current List                        |
|   m   |  Moves the board to the next or previous tab location  |       Moves the list in the direction given next       |      move the item up and down the current list or to the previous or next list      |
|   x   |               Deletes the current board                |                Deletes the current list                |                               Deletes the current Item                               |
|   j   |                Highlight the first list                |                Highlight the first Item                |                    Move the cursor to the next Item down the list                    |
|   k   |                        Nothing                         |                        Nothing                         |                          Move the current item up the list                           |
|   h   |           Move to the next board to the left           |           Move to the next list to the left            | Move to the next list to the left with the item at the same count level highlighted  |
|   l   |          Move to the next board to the right           |           Move to the next list to the right           | Move to the next list to the right with the item at the same count level highlighted |
|   b   |  Go to the board number pressed before the b key. | Go to the board number pressed before the b key. | Go to the board number pressed before the b key. |
|  Esc  | Clear all highlights and just have the board selected. | Clear all highlights and just have the board selected. |                Clear all highlights and just have the board selected.                |
| Enter |                        Nothing                         |                        Nothing                         |                 Opens the List Item that is highlighted for editing.                 |

If a number key is pressed before a hot key is pressed, it is stored in the accumulator. When a hot key is pressed, then that action is performed the number of times that the accumulator has stored. For example, if you press '2l', you will move to the 2nd list to the right of the cursor or if no cursors are shown, then to the second board to the right of the current board. Be careful when using this combined with the 'x' or delete key! Pressing '99x' with just the list cursor highlighted will delete all your lists in the current board!

# Planned features
The following is a list of the features I plan to add in no particular order. If you have a feature you would like to see, just let me know and I'll add it to the list.

## Features to add:

- Meta grouping of boards and moving between them.
- Copying and pasting board or list setups to a new board or list.
- The ability to load themes from a GitHub repository and changing or creating themes.
- Add drag and drop with the mouse.
- Add keyboard hotkeys for editing an item. Currently you have to use the mouse and double click on things to add them.
- Add more apps for items. Currently there is only a todo list app.
- Command bar to see commands and actioning them.
- The ability for the user to add new commands. Downloading commands from GitHub as well.


