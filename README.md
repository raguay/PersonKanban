![PersonKanban](https://socialify.git.ci/raguay/PersonKanban/image?description=1&font=Source%20Code%20Pro&forks=1&issues=1&language=1&owner=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Dark)
[![Richard's GitHub stats](https://github-readme-stats.vercel.app/api?username=raguay)](https://github.com/anuraghazra/github-readme-stats)
# PersonKanban

A lightweight personal Kanban board for everyday use.

It is currently a working Alpha project with many of the planned features in place. I am currently using it daily to track my projects and bugs. It is currently a complete keyboard program without any drag & drop features. The keyboard hotkeys work similarly to NeoVim and Vim modal systems. But, in the Personal Kanban program, the cursor (highlighted lists or items and tabs for the boards) control the action of each key.

# How to Build
It is built using [Wails 2](wails.io) and [Go](golang.org). Once they are installed on your system, you can run it using:

```sh
wails dev
```

or you can use the Maskfile to run [Mask]() scripts:

```sh 
mask dev
```

To run the developmental environment. To make a full binary build, you need to run:

```sh
wails build
```
or you can use the Maskfile to run [Mask]() scripts:

```sh 
mask build 
```

Just remember, this is alpha quality software at the moment. Use at your own risk. Also, the mask build currently creates a universal build on macOS. I haven't built and tried this software on any other platform. It should work as is on Linux, but I haven't really tried it yet.

# Hot Keys
The following are the keyboard assignments and what they do for each mode:

| Key   | Just board selected                                                                       | List is highlighted                                                                       | Item in a list is highlighted                                                             | Item is open                                                                                |
| :---: | :---------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------- |
|   a   |                                    Creates a new board                                    |                          Creates a new list in the current board                          |                          Creates a new Item in the current List                           | Nothing                                                                                     |
|   m   |                   Moves the board to the next or previous tab location                    |                        Moves the list in the direction given next                         |        move the item up and down the current list or to the previous or next list         | Puts the cursor into the message input box.                                                 |
|   x   |                                 Deletes the current board                                 |                                 Deletes the current list                                  |                                 Deletes the current Item                                  | Nothing                                                                                     |
|   j   |                                 Highlight the first list                                  |                                 Highlight the first Item                                  |                      Move the cursor to the next Item down the list                       | Nothing                                                                                     |
|   k   |                                          Nothing                                          |                                          Nothing                                          |                             Move the current item up the list                             | Nothing                                                                                     |
|   h   |                            Move to the next board to the left                             |                             Move to the next list to the left                             |    Move to the next list to the left with the item at the same count level highlighted    | Nothing                                                                                     |
|   l   |                            Move to the next board to the right                            |                            Move to the next list to the right                             |   Move to the next list to the right with the item at the same count level highlighted    | Nothing                                                                                     |
|   b   |                     Go to the board number pressed before the b key.                      |                     Go to the board number pressed before the b key.                      |                     Go to the board number pressed before the b key.                      | Nothing                                                                                     |
|   t   |                                Open the Metaboard selector                                |                                Open the Metaboard selector                                |                                Open the Metaboard selector                                | Nothing                                                                                     |
|   e   |                                   Edits the board name                                    |                                    Edits the list name                                    |                                          Nothing                                          | If followed by a 't', the title is edited. If followed by a 'd', the description is edited. |
|   s   |                                          Nothing                                          |                                          Nothing                                          |                                          Nothing                                          | Save all changes and close the item edit dialog.                                            |
|  Esc  |                  Clear all highlights and just have the board selected.                   |                  Clear all highlights and just have the board selected.                   |                  Clear all highlights and just have the board selected.                   | Close the item edit dialog.                                                                 |
| Enter |                                          Nothing                                          |                                          Nothing                                          |                   Opens the List Item that is highlighted for editing.                    | Nothing                                                                                     |
| Space |       Opens the QuickBar to add a new board with a description separated by a `\|`.       |                           Opens the QuickBar to add a new list.                           |        Opens the QuickBar to add a new item with a description separated by `\|`.         | Nothing                                                                                     |
|   .   |                                 Repeats the last command                                  |                                 Repeats the last command.                                 |                                 Repeats the last command.                                 | Nothing                                                                                     |
|  0-9  | Creates a multiple digit accumulator for the number of times to execute the next command. | Creates a multiple digit accumulator for the number of times to execute the next command. | Creates a multiple digit accumulator for the number of times to execute the next command. | Creates a multiple digit accumulator for the number of times to execute the next command.   |

If a number key is pressed before a hot key is pressed, it is stored in the accumulator. When a hot key is pressed, then that action is performed the number of times that the accumulator has stored. For example, if you press '2l', you will move to the 2nd list to the right of the cursor or if no cursors are shown, then to the second board to the right of the current board. Be careful when using this combined with the 'x' or delete key! Pressing '99x' with just the list cursor highlighted will delete all your lists in the current board (Unless you have more than 99 lists)!

# Planned features
The following is a list of the features I plan to add in no particular order. If you have a feature you would like to see, just let me know and I'll add it to the list.

## Features to add:

- Meta grouping of boards and moving between them. - done
- A quick entry ability to quickly add different items. - done
- Copying and pasting board or list setups to a new board or list.
- The ability to load themes from a GitHub repository and changing or creating themes.
- Add drag and drop with the mouse.
- Add keyboard hotkeys for editing an item. Currently you have to use the mouse and double click on things to add them. - done
- Add more apps for items. Currently there is only a todo list app.
- Command bar to see commands and actioning them. - done It is called the QuickBar.
- The ability for the user to add new commands and themes. Downloading commands from GitHub as well.
- The ability to change themes and create new themes.


