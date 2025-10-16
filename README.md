![PersonKanban](https://socialify.git.ci/raguay/PersonKanban/image?description=1&font=Source%20Code%20Pro&forks=1&issues=1&language=1&owner=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Dark)
[![Richard's GitHub stats](https://github-readme-stats.vercel.app/api?username=raguay)](https://github.com/anuraghazra/github-readme-stats)

# PersonKanban

A lightweight personal Kanban board for everyday use.

![Personal Kanban](https://github.com/raguay/PersonKanban/blob/main/images/PersonalKanban.webp)

You also can create, delete, and navigate around collections of boards call MetaBoards.

![Personal Kanban MetaBoards](https://github.com/raguay/PersonKanban/blob/main/images/PersonalKanban-2.webp)

Personal Kanban also has a CommandBar to run special commands.

![Personal Kanban CommandBar](https://github.com/raguay/PersonKanban/blob/main/images/PersonalKanban-3.webp)

There is also a QuickBar to quickly add new items like boards, lists, and items.

![Personal Kanban QuickBar](https://github.com/raguay/PersonKanban/blob/main/images/PersonalKanban-4.webp)

It is currently a working Beta project with many of the planned features in place. I am currently using it daily to track my projects and bugs. It is currently a complete keyboard program without any drag & drop features. The keyboard hotkeys work similarly to NeoVim and Vim modal systems. But, in the Personal Kanban program, the cursor (highlighted lists or items and tabs for the boards) control the action of each key.

# Table of Contents

- [How to Build](#how-to-build)
- [Installing from Releases](#installing-from-releases)
- [How to Use](#how-to-use)
- [Hot Keys](#hot-keys)
- [Command Bar Commands](#command-bar-commands)
- [Quick Bar Usage](#quick-bar-usage)
- [Planned Features](#planned-features)
- [My Different Open Source Projects](#my-different-open-source-projects)

# How to Build

It is built using [Wails 2](wails.io) and [Go](golang.org). Once they are installed on your system, you can run it using:

```sh
rm -R build
mkdir build
cp image/appicon.png build

wails dev
```

or you can use the Maskfile to run [Mask](https://github.com/jacobdeichert/mask) scripts:

```sh
rm -R build
mkdir build
cp image/appicon.png build

mask dev
```

To run the developmental environment. To make a full binary build, you need to run:

```sh
rm -R build
mkdir build
cp image/appicon.png build

wails build
```

I recommend that you can use the Maskfile to run [Mask](https://github.com/jacobdeichert/mask) scripts:

```sh
mask build
```

Just remember, this is beta quality software at the moment. Use at your own risk. Also, the mask build currently creates a universal build on macOS. I haven't built and tried this software on any other platform. It should work as is on Linux, but I haven't really tried it yet.

# Installing from Releases

You can also download the latest release on the release page. I currently only have a macOS universal build. It will say that it is from a unknown developer. You just have to give it permission in order to use it. I write programs for my personal use and anyone that wants to use them. Since I'm not making money with it, I don't want to spend the $100/year to have Apple to qualify it for general distribution. As with any free program you download, use it at your own risk. I so far haven't had any issues with this program. It only save information to the harddrive in the user's home directory. It never deletes anything. If you have any issues or have a suggestion, please leave a comment on the [discussion board](https://github.com/raguay/PersonKanban/discussions).

# How to Use

When you first open the program, it will create a default board ready to create lists and items in the lists. The hotkeys list below will guide you to using the program.

# Hot Keys

The following are the keyboard assignments and what they do for each mode:

|  Key  |                                    Just board selected                                    |                                    List is highlighted                                    |                               Item in a list is highlighted                               | Item is open                                                                                |
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
|   :   |                                   Opens the CommandBar                                    |                                   Opens the CommandBar                                    |                                   Opens the CommandBar                                    | Nothing                                                                                     |
|  Esc  |                  Clear all highlights and just have the board selected.                   |                  Clear all highlights and just have the board selected.                   |                  Clear all highlights and just have the board selected.                   | Close the item edit dialog.                                                                 |
| Enter |                                          Nothing                                          |                                          Nothing                                          |                   Opens the List Item that is highlighted for editing.                    | Nothing                                                                                     |
| Space |       Opens the QuickBar to add a new board with a description separated by a `\|`.       |                           Opens the QuickBar to add a new list.                           |        Opens the QuickBar to add a new item with a description separated by `\|`.         | Nothing                                                                                     |
|   .   |                                 Repeats the last command                                  |                                 Repeats the last command.                                 |                                 Repeats the last command.                                 | Nothing                                                                                     |
|  0-9  | Creates a multiple digit accumulator for the number of times to execute the next command. | Creates a multiple digit accumulator for the number of times to execute the next command. | Creates a multiple digit accumulator for the number of times to execute the next command. | Creates a multiple digit accumulator for the number of times to execute the next command.   |

If a number key is pressed before a hot key is pressed, it is stored in the accumulator. When a hot key is pressed, then that action is performed the number of times that the accumulator has stored. For example, if you press '2l', you will move to the 2nd list to the right of the cursor or if no cursors are shown, then to the second board to the right of the current board. Be careful when using this combined with the 'x' or delete key! Pressing '99x' with just the list cursor highlighted will delete all your lists in the current board (Unless you have more than 99 lists)!

# Command Bar Commands

These are the commands that can be used in the Command Bar:

| Command                 | Description                                                                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Open Preferences        | Opens the preferences for the currently selected item.                                                            |
| Add a New Board         | Adds a new board to the list of boards.                                                                           |
| Delete Current Board    | Deletes the currently highlighted board.                                                                          |
| Delete Current List     | Deletes the currently highlighted list.                                                                           |
| Delete Current Item     | Deletes the currently highlighted item.                                                                           |
| Add New List            | Adds a new list to the current board.                                                                             |
| Add New Item            | Adds a new item to the currently selected list.                                                                   |
| Open Current Item       | Opens the currently selected item for editing.                                                                    |
| Move Board Cursor Left  | Moves the board cursor to the left if not on the left most board.                                                 |
| Move Board Cursor Right | Moves the board cursor to the right if not on the right most board.                                               |
| Move List Cursor Left   | Moves the list cursor to the left if not on the left most list.                                                   |
| Move List Cursor Right  | Moves the list cursor to the right if not on the right most list.                                                 |
| Move Item Cursor Up     | Moves the item cursor up if not on the top most item.                                                             |
| Move Item Cursor Down   | Moves the item cursor down if not on the bottom most item.                                                        |
| Quit                    | This command will exit the program.                                                                               |
| Edit Board Name         | Edit the name of the current board.                                                                               |
| Edit List Title         | Edit the title of the current list.                                                                               |
| Go To Top               | Move cursor to the top most item, left most list, or left most board depending on what the cursor is on.          |
| Go To Bottom            | Move the cursor to the bottom most item, right most list, or right most board depending on what the cursor is on. |
| Copy Board Preferences  | Makes a copy of the current board's preferences.                                                                  |
| Copy List Preferences   | Makes a copy of the current list's preferences.                                                                   |
| Copy Item Preferences   | Makes a copy of the current item's preferences.                                                                   |
| Paste Board Preferences | Pastes the board's preferences that was copied.                                                                   |
| Paste List Preferences  | Paste the list's preferences that was copied.                                                                     |
| Paste Item Preferences  | Paste the item's preferences that was copied.                                                                     |
| Show System Preferences | Show the system preferences dialog.                                                                               |

# Quick Bar Usage

By pressing the space bar, an input dialog is shown where you can add boards, lists, or items based on the cursor. If the cursor isn't shown, then the new items are applied as new boards. If just a list has a cursor, then the new items are added as lists to the current board. If an item is highlighted by a cursor, then new items are added as items to the current list.

If more than one items are separated by ";;", then multiple items are created with the titles given. If items are being added, you can add descriptions by separating the title from the description with a "|".

# Planned features

The following is a list of the features I plan to add in no particular order. If you have a feature you would like to see, just let me know and I'll add it to the list.

## Features to add

- [x] Meta grouping of boards and moving between them. - done
- [x] A quick entry ability to quickly add different items. - done
- [x] Copying and pasting board or list setups to a new board or list.
- [x] The ability to load themes from a GitHub repository and changing or creating themes.
- [ ] Add drag and drop with the mouse.
- [x] Add keyboard hotkeys for editing an item. Currently you have to use the mouse and double click on things to add them. - done
- [ ] Add more apps for items. Currently there is only a todo list app.
- [x] Command bar to see commands and actioning them. - done It is called the QuickBar.
- [ ] The ability for the user to add new commands and themes. Downloading commands from GitHub as well.
- [ ] The ability to change themes and create new themes.
- [ ] Create a way to do things with Personal Kanban from the command line.
- [ ] Add documentation on how to use Personal Kanban.
- [ ] Maybe a TUI

## My Different Open Source Projects

[EmailIt](https://github.com/raguay/EmailIt)

[BullitenBoard](https://github.com/raguay/BulletinBoard)

[ScriptBar](https://github.com/raguay/scriptbarapp)

[Modal File Manager](https://github.com/raguay/ModalFileManager)

[Personal Kanban](https://github.com/raguay/PersonKanban)
