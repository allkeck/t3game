package app

import (
	"t3game/internal/game"
)

type (
	GameApp struct {
		storage game.GameStorage
	}
)

func NewGameApp() *GameApp {
	return &GameApp{
		storage: game.InitStorage(),
	}
}

func (app *GameApp) NewGame() game.Game {
	return app.storage.NewGame()
}

func (app *GameApp) ListGames() map[string]game.Game {
	return app.storage.ListGames()
}

func (app *GameApp) GetGame(uid string) game.Game {
	return app.storage.GetGame(uid)
}
