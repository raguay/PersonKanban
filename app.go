package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	github "github.com/google/go-github/v49/github"
	wailsruntime "github.com/wailsapp/wails/v2/pkg/runtime"
	"io/fs"
	"os"
	"path/filepath"
	goruntime "runtime"
)

// The data structures used in the program.
type BoardData struct {
	Id    int64      `json:"id" binding:"required"`
	Name  string     `json:"name" binding:"required"`
	Lists []ListData `json:"list" binding:"required"`
}

type ListData struct {
	Id    int64      `json:"id" binding:"required"`
	Name  string     `json:"name" binding:"required"`
	Items []ItemData `json:"items" binding:"required"`
}

type ItemData struct {
	Id          int64    `json:"id" binding:"required"`
	Name        string   `json:"name" binding:"required"`
	Description string   `json:"Description" binding:"required"`
	Color       string   `json:"color" binding:"required"`
	Notes       []string `json:"note" binding:"required"`
}

type KanbanData struct {
	Boards []BoardData `json:"boards" binding:"required"`
}

type ThemeData struct {
	Backgroundcolor      string `json:"backgroundcolor" binding:"required"`
	Textcolor            string `json:"textcolor" binding:"required"`
	UnselectTabColor     string `json:"unselectTabColor" binding:"required"`
	UnselectTabTextColor string `json:"unselectTabTextColor" binding:"required"`
	SelectTabColor       string `json:"selectTabColor" binding:"required"`
	SelectTabTextColor   string `json:"selectTabTextColor" binding:"required"`
	Mainboardcolor       string `json:"mainboardColor" binding:"required"`
	Listcontainercolor   string `json:"listcontainercolor" binding:"required"`
	Listbgcolor          string `json:"listbgcolor" binding:"required"`
	Listtextcolor        string `json:"listtextcolor" binding:"required"`
	Itembgcolor          string `json:"itembgcolor" binding:"required"`
	Itemtextcolor        string `json:"itemtextcolor" binding:"required"`
	Font                 string `json:"font" binding:"required"`
	DialogBGColor        string `json:"dialogBGColor" binding:"required"`
	DialogTextColor      string `json:"dialogTextColor" binding:"required"`
	KanbanInfo           string `json:"kanbanInfo" binding:"required"`
}

type FileParts struct {
	Dir       string
	Name      string
	Extension string
}

type GitHubRepos struct {
	Name        string `json:"name"`
	URL         string `json:"url"`
	Stars       int    `json:"stars"`
	Owner       string `json:"owner"`
	ID          int64  `json:"id"`
	Description string `json:"description"`
}

// App struct
type App struct {
	ctx    context.Context
	Kanban KanbanData
	Theme  ThemeData
	err    string
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
	hdir := a.GetHomeDir()
	configdir := a.AppendPath(hdir, ".config")
	kbcnfgdir := a.AppendPath(configdir, "PersonKanban")
	if a.FileExists(kbcnfgdir) {
		//
		// The directory exist, so read the config file.
		//
		a.Theme = a.ReadTheme()
		a.Kanban = a.ReadKanban()
	} else {
		//
		// Create the directory and default files.
		//
		a.MakeDir(kbcnfgdir)
		a.Theme = ThemeData{
			Backgroundcolor:      "blue",
			Textcolor:            "white",
			UnselectTabColor:     "lightgray",
			UnselectTabTextColor: "black",
			SelectTabColor:       "lightblue",
			SelectTabTextColor:   "black",
			Mainboardcolor:       "lightblue",
			Listcontainercolor:   "lightblue",
			Listbgcolor:          "#9AC2FA",
			Listtextcolor:        "white",
			Itembgcolor:          "white",
			Itemtextcolor:        "black",
			Font:                 "\"Fira Code\"",
			DialogBGColor:        "lightblue",
			DialogTextColor:      "black",
			KanbanInfo:           "black",
		}
		a.Kanban = KanbanData{}
		themestring, _ := json.Marshal(a.Theme)
		a.SaveTheme(string(themestring))
		kanbanstring, _ := json.Marshal(a.Kanban)
		a.SaveKanbanBoards(string(kanbanstring))
	}
}

func (a *App) SaveTheme(theme string) {
	hdir := a.GetHomeDir()
	configdir := a.AppendPath(hdir, ".config")
	kbcnfgdir := a.AppendPath(configdir, "PersonKanban")
	themefile := a.AppendPath(kbcnfgdir, "theme.json")
	a.WriteFile(themefile, theme)
}

func (a *App) SaveKanbanBoards(kanban string) {
	hdir := a.GetHomeDir()
	configdir := a.AppendPath(hdir, ".config")
	kbcnfgdir := a.AppendPath(configdir, "PersonKanban")
	kanbanfile := a.AppendPath(kbcnfgdir, "kanban.json")
	a.WriteFile(kanbanfile, kanban)
}

func (a *App) ReadThemeString() string {
	hdir := a.GetHomeDir()
	configdir := a.AppendPath(hdir, ".config")
	kbcnfgdir := a.AppendPath(configdir, "PersonKanban")
	themefile := a.AppendPath(kbcnfgdir, "theme.json")
	filedata := a.ReadFile(themefile)
	return filedata
}

func (a *App) ReadKanbanString() string {
	hdir := a.GetHomeDir()
	configdir := a.AppendPath(hdir, ".config")
	kbcnfgdir := a.AppendPath(configdir, "PersonKanban")
	kanbanfile := a.AppendPath(kbcnfgdir, "kanban.json")
	filedata := a.ReadFile(kanbanfile)
	return filedata
}

func (a *App) ReadTheme() ThemeData {
	hdir := a.GetHomeDir()
	configdir := a.AppendPath(hdir, ".config")
	kbcnfgdir := a.AppendPath(configdir, "PersonKanban")
	themefile := a.AppendPath(kbcnfgdir, "theme.json")
	filedata := a.ReadFile(themefile)
	err := json.Unmarshal([]byte(filedata), &a.Theme)
	if err != nil {
		a.err = err.Error()
	}
	return a.Theme
}

func (a *App) ReadKanban() KanbanData {
	hdir := a.GetHomeDir()
	configdir := a.AppendPath(hdir, ".config")
	kbcnfgdir := a.AppendPath(configdir, "PersonKanban")
	kanbanfile := a.AppendPath(kbcnfgdir, "kanban.json")
	filedata := a.ReadFile(kanbanfile)
	err := json.Unmarshal([]byte(filedata), &a.Kanban)
	if err != nil {
		a.err = err.Error()
	}
	return a.Kanban
}

func (b *App) GetExecutable() string {
	ex, err := os.Executable()
	if err != nil {
		b.err = err.Error()
	}
	return ex
}

func (b *App) Getwd() string {
	wd, err := os.Getwd()
	if err != nil {
		b.err = err.Error()
	}
	return wd
}

func (b *App) ReadFile(path string) string {
	b.err = ""
	contents, err := os.ReadFile(path)
	if err != nil {
		b.err = err.Error()
	}
	return string(contents[:])
}

func (b *App) GetHomeDir() string {
	b.err = ""
	hdir, err := os.UserHomeDir()
	if err != nil {
		b.err = err.Error()
	}
	return hdir
}

func (b *App) WriteFile(path string, data string) {
	err := os.WriteFile(path, []byte(data), 0666)
	if err != nil {
		b.err = err.Error()
	}
}

func (b *App) FileExists(path string) bool {
	b.err = ""
	_, err := os.Stat(path)
	return !errors.Is(err, os.ErrNotExist)
}

func (b *App) DirExists(path string) bool {
	b.err = ""
	dstat, err := os.Stat(path)
	if err != nil {
		b.err = err.Error()
		return false
	}
	return dstat.IsDir()
}

func (b *App) SplitFile(path string) FileParts {
	b.err = ""
	var parts FileParts
	parts.Dir, parts.Name = filepath.Split(path)
	parts.Extension = filepath.Ext(path)
	return parts
}

func (b *App) MakeDir(path string) {
	b.err = ""
	err := os.MkdirAll(path, 0755)
	if err != nil {
		b.err = err.Error()
	}
}

func (b *App) MakeFile(path string) {
	b.err = ""
	b.WriteFile(path, "")
}

func (b *App) GetError() string {
	return b.err
}

func (b *App) DeleteEntries(path string) {
	b.err = ""
	err := os.RemoveAll(path)
	if err != nil {
		b.err = err.Error()
	}
}

func (b *App) CreateTempFile(contents string) string {
	//
	// Create the temperary file.
	//
	f, err := os.CreateTemp("", "extscript*")
	if err != nil {
		b.err = err.Error()
	}
	fname := f.Name()

	//
	// Write the contents.
	//
	if _, err := f.Write([]byte(contents)); err != nil {
		b.err = err.Error()
	}

	//
	// Close the file.
	//
	if err := f.Close(); err != nil {
		b.err = err.Error()
	}

	//
	// Return the results.
	//
	return (fname)
}

func (b *App) Chmod(file string, nmode fs.FileMode) {
	err := os.Chmod(file, nmode)
	if err != nil {
		b.err = err.Error()
	}
}

func (b *App) AppendPath(dir string, name string) string {
	return filepath.Join(dir, name)
}

func (b *App) Quit() {
	wailsruntime.Quit(b.ctx)
}

func (b *App) GetOSName() string {
	os := goruntime.GOOS
	result := ""
	switch os {
	case "windows":
		result = "windows"
		break
	case "darwin":
		result = "macos"
	case "linux":
		result = "linux"
	default:
		result = fmt.Sprintf("%s", os)
	}
	return result
}

func (b *App) GetGitHubThemes() []GitHubRepos {
	var result []GitHubRepos
	client := github.NewClient(nil)
	topics, _, err := client.Search.Repositories(context.Background(), "in:topic personalkanban in:topic theme", nil)
	if err == nil {
		total := *topics.Total
		result = make([]GitHubRepos, total, total)
		for i := 0; i < total; i++ {
			result[i].ID = *topics.Repositories[i].ID
			result[i].Name = *topics.Repositories[i].Name
			result[i].Owner = *topics.Repositories[i].Owner.Login
			result[i].URL = *topics.Repositories[i].CloneURL
			result[i].Stars = *topics.Repositories[i].StargazersCount
			result[i].Description = *topics.Repositories[i].Description
		}
	}
	return result
}
