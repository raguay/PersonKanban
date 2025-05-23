package main

import (
	"context"
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	goruntime "runtime"

	github "github.com/google/go-github/v49/github"
	wailsruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

// The data structures used in the program.
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
	ctx context.Context
	err string
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
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
	b.err = ""
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
