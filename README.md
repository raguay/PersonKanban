![PersonKanban](https://socialify.git.ci/raguay/PersonKanban/image?description=1&font=Source%20Code%20Pro&forks=1&issues=1&language=1&owner=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Dark)
[![Richard's GitHub stats](https://github-readme-stats.vercel.app/api?username=raguay)](https://github.com/anuraghazra/github-readme-stats)

# PersonKanban

A lightweight personal Kanban board for everyday use. It is built around the ideal that you want to only (or mostly) use the keyboard. While there are some controls that are clickable for using them (such as double clicking on a title of a list will edit that title. Or, double clicking on an item will open it for editing.), it was designed from the ground up to be a fully keyboard driven kanban board. The hotkey system is very similar to the modal editing found in vim/neovim. While the actual keys used are hard coded right now, I do have a future plan to make them modifiable. There are many things I have plans for that I am looking for time to implement.

While I do call it a kanban board, I do know that it doesn't work by the actual definition of a kanban board. Therefore, please don't flame me that it isn't a kanban boaard. It is my interpretation of it and has worked quite well for me for several years now. If you don't like something, let me know in the discussion boards of this repo and I might work on it when I have time. Or, fork this repo, make the edits, and submit a pull request. I would love and accept help in making this program more usable.

The program looks like this:

![Personal Kanban](https://github.com/raguay/PersonKanban/blob/main/images/PersonalKanban.webp)

Along the top of the programs is the list of boards. The highlighted tab shows is the currently open board in the rest of the screen. Each board has as many lists as you would like to have. Also, each list has as many items as you want to add to them.

You can create, delete, and navigate around collections of boards call MetaBoards. The ideal is that each board collection, or metaboard, represents different projects or responsibilities.

![Personal Kanban MetaBoards](https://github.com/raguay/PersonKanban/blob/main/images/PersonalKanban-2.webp)

Personal Kanban also has a CommandBar to run special commands.

![Personal Kanban CommandBar](https://github.com/raguay/PersonKanban/blob/main/images/PersonalKanban-3.webp)

There is also a QuickBar to quickly add new items like boards, lists, and items.

![Personal Kanban QuickBar](https://github.com/raguay/PersonKanban/blob/main/images/PersonalKanban-4.webp)

The QuickBar can create a single or multiple objects like the currently highlighted object. For example, if you want to quickly add several lists to a board, you can separate each list name with `;;` (two semi-colons) as in: `Ideas;;Bugs;;Working;;Done`. When you press `Enter` the four lists will be created. If you are on an empty board, just press the `j` key like you were going to navigate down to one and then open the QuickBar to add the new lists. The quick bar also has the ability to store several prompts for it into a single letter name or easy recall in a different project.

It is very stable project with many of the planned features in place. I am currently using it daily to track my programming projects, churches (I'm a missionary in Thailand), schedules, events, bugs, and anything you would make a todo list to track. It is currently a complete keyboard program without any drag & drop features. The keyboard hotkeys work similarly to NeoVim and Vim modal systems. But, in the Personal Kanban program, the cursor (highlighted lists or items and tabs for the boards) control the action of each key.

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
mask dev
```

To run the developmental environment. To make a full binary build, you need to run:

```sh
wails build
```

I recommend that you can use the Maskfile to run [Mask](https://github.com/jacobdeichert/mask) scripts:

```sh
mask build
```

Just remember, this is not high quality commercial software that you would pay for at the moment (though it is my goal). It is a labor of love that I work on as I can. Use at your own risk. I can not be held responsible for any loss of files, disk damage, etc. As far as I know, Personal Kanban isn't able to cause these things to happen.

The mask build currently creates a universal build on macOS. I haven't built and tried this software on any other platform. It should work as is on Linux, but I haven't really tried it yet. I just haven't had the time to do it. If you would like to contribute executeables for other systems, let me know and I can add them to the Releases.

# Installing from Releases

You can also download the latest release on the release page. I currently only have a macOS universal build. It will say that it is from an unknown developer. You just have to give it permission in order to use it. I write programs for my personal use and anyone that wants to use them. Since I'm not making money with it, I don't want to spend the $100/year to have Apple to qualify it for general distribution. As with any free program you download, use it at your own risk. I so far haven't had any issues with this program. It only saves information to the harddrive in the user's home directory. It never deletes anything. If you have any issues or have a suggestion, please leave a comment on the [discussion board](https://github.com/raguay/PersonKanban/discussions).

# How to Use

When you first open the program, it will create a default board ready to create lists and items in the lists. The hotkeys list below will guide you to using the program.

# Hot Keys

The following are the keyboard assignments and what they do for each mode:

|  Key  |                                    Just board selected                                    |                                    List is highlighted                                    |                               Item in a list is highlighted                               |                                        Item is open                                         |                      Quick Bar                      |
| :---: | :---------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: | :-------------------------------------------------: |
|   a   |                                    Creates a new board                                    |                          Creates a new list in the current board                          |                          Creates a new Item in the current List                           |                                           Nothing                                           |                       Nothing                       |
|   m   |                   Moves the board to the next or previous tab location                    |                        Moves the list in the direction given next                         |        move the item up and down the current list or to the previous or next list         |                         Puts the cursor into the message input box.                         |                       Nothing                       |
|   x   |                                 Deletes the current board                                 |                                 Deletes the current list                                  |                                 Deletes the current Item                                  |                                           Nothing                                           |                       Nothing                       |
|   j   |                                 Highlight the first list                                  |                                 Highlight the first Item                                  |                      Move the cursor to the next Item down the list                       |                                           Nothing                                           |       Scroll down the list of saved registers       |
|   k   |                                          Nothing                                          |                                          Nothing                                          |                             Move the current item up the list                             |                                           Nothing                                           |        Scroll up the list of saved registers        |
|   h   |                            Move to the next board to the left                             |                             Move to the next list to the left                             |    Move to the next list to the left with the item at the same count level highlighted    |                                           Nothing                                           |                       Nothing                       |
|   l   |                            Move to the next board to the right                            |                            Move to the next list to the right                             |   Move to the next list to the right with the item at the same count level highlighted    |                                           Nothing                                           |                       Nothing                       |
|   b   |                     Go to the board number pressed before the b key.                      |                     Go to the board number pressed before the b key.                      |                     Go to the board number pressed before the b key.                      |                                           Nothing                                           |                       Nothing                       |
|   t   |                                Open the Metaboard selector                                |                                Open the Metaboard selector                                |                                Open the Metaboard selector                                |                                           Nothing                                           |                       Nothing                       |
|   e   |                                   Edits the board name                                    |                                    Edits the list name                                    |                                          Nothing                                          | If followed by a 't', the title is edited. If followed by a 'd', the description is edited. |                       Nothing                       |
|   s   |                                          Nothing                                          |                                          Nothing                                          |                                          Nothing                                          |                      Save all changes and close the item edit dialog.                       |         Toggle showing the saved registers          |
|   :   |                                   Opens the CommandBar                                    |                                   Opens the CommandBar                                    |                                   Opens the CommandBar                                    |                                           Nothing                                           |                       Nothing                       |
|  Esc  |                  Clear all highlights and just have the board selected.                   |                  Clear all highlights and just have the board selected.                   |                  Clear all highlights and just have the board selected.                   |                                 Close the item edit dialog.                                 |                       Nothing                       |
| Enter |                                          Nothing                                          |                                          Nothing                                          |                   Opens the List Item that is highlighted for editing.                    |                                           Nothing                                           |             Create the Quick Bar items              |
| Space |       Opens the QuickBar to add a new board with a description separated by a `\|`.       |                           Opens the QuickBar to add a new list.                           |        Opens the QuickBar to add a new item with a description separated by `\|`.         |                                           Nothing                                           |                       Nothing                       |
|   .   |                                 Repeats the last command                                  |                                 Repeats the last command.                                 |                                 Repeats the last command.                                 |                                           Nothing                                           |                       Nothing                       |
|  0-9  | Creates a multiple digit accumulator for the number of times to execute the next command. | Creates a multiple digit accumulator for the number of times to execute the next command. | Creates a multiple digit accumulator for the number of times to execute the next command. |  Creates a multiple digit accumulator for the number of times to execute the next command.  |                       Nothing                       |
|   y   |                                          Nothing                                          |                                          Nothing                                          |                                          Nothing                                          |                                           Nothing                                           | Save to the register that is captured after the 'y' |
|   p   |                                          Nothing                                          |                                          Nothing                                          |                                          Nothing                                          |                                           Nothing                                           |  Paste the register that is captured after the 'p'  |
|   d   |                                          Nothing                                          |                                          Nothing                                          |                                          Nothing                                          |                                           Nothing                                           |  Delete the register given in the next key stroke.  |

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

By pressing the space bar, an input dialog is shown where you can add boards, lists, or items based on the cursor. If the cursor isn't shown (the cursor is the highlighting around a list or item), then the new items are applied as new boards. If just a list has a cursor, then the new items are added as lists to the current board. If an item is highlighted by a cursor, then new items are added as items to the current list.

If more than one items are separated by ";;", then multiple items are created with the titles given. If items are being added, you can add descriptions by separating the title from the description with a "|".

# Planned features

The following is a list of the features I plan to add in no particular order. If you have a feature you would like to see, just let me know and I'll add it to the list.

## Features to add

- [x] Meta grouping of boards and moving between them. - done
- [x] A quick entry ability to quickly add different items. - done
- [x] Copying and pasting board or list setups to a new board or list.
- [x] The ability to load themes from a GitHub repository and changing or creating themes.
- [x] Saving of new window size, position, and last metaboard visited.
- [x] Add keyboard hotkeys for editing an item. Currently you have to use the mouse and double click on things to add them. - done
- [x] Command bar to see commands and actioning them. - done It is called the QuickBar.
- [ ] Add more apps for items. Currently there is only a todo list app.
- [ ] Add drag and drop with the mouse.
- [ ] The ability for the user to add new commands and themes. Downloading commands or themes from GitHub as well.
- [ ] The ability to change themes and create new themes.
- [ ] Create a way to do things with Personal Kanban from the command line.
- [ ] Add to the documentation on how to use Personal Kanban.
- [ ] Maybe a TUI

## My Different Open Source Projects

[EmailIt](https://github.com/raguay/EmailIt)

[BullitenBoard](https://github.com/raguay/BulletinBoard)

[ScriptBar](https://github.com/raguay/scriptbarapp)

[Modal File Manager](https://github.com/raguay/ModalFileManager)

[Personal Kanban](https://github.com/raguay/PersonKanban)
