package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Personal Kanban",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 0},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		Frameless:						 true,
    CSSDragProperty:   "--wails-draggable",
    CSSDragValue:      "drag",
    Mac: &mac.Options{
             TitleBar:             mac.TitleBarHiddenInset(),
             Appearance:           mac.NSAppearanceNameDarkAqua,
             WebviewIsTransparent: true,
             WindowIsTranslucent:  true,
             About: &mac.AboutInfo{
                    Title:   "Personal Kanban",
                    Message: "© 2022 Richard Guay <raguay@customct.com>",
             },
    },
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
