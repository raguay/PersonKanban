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
|  Esc  | Clear all highlights and just have the board selected. | Clear all highlights and just have the board selected. |                Clear all highlights and just have the board selected.                |
| Enter |                        Nothing                         |                        Nothing                         |                 Opens the List Item that is highlighted for editing.                 |
