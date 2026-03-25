## dev

```zsh
rm -R build
mkdir build
cp image/appicon.png build

wails dev
```

## build

```zsh
rm -R build
mkdir build
cp image/appicon.png build

wails build --platform "darwin/universal"
```
