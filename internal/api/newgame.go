package api

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"t3game/internal/app"
)

func NewGameHandlerCreator(app *app.GameApp) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		logger := slog.With("op", "api:NewGameHandler")
		newGame := app.NewGame()
		logger.Info("game created", "uid", newGame.Uid)
		json.NewEncoder(w).Encode(newGame)
	}
}
