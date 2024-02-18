package api

import (
	"encoding/json"
	"net/http"
	"t3game/internal/app"
)

func ListGamesHandlerCreator(app *app.GameApp) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		games := app.ListGames()
		json.NewEncoder(w).Encode(games)
	}
}
