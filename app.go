package main

import (
	"context"
)

// The data structures used in the program.
type KanbanData struct {
}

type Theme struct {
}

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	//
	// Set the default values for the data and theme objects.
	//

	//
	// Read the data and theme objects from the harddrive. If they don't exist, create them with
	// the defaults.
	//
}
