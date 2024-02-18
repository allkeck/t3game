package api

import (
	"encoding/json"
	"net/http"
	"strings"
	"t3game/internal/app"
)

func GameForUidHandlerCreator(app *app.GameApp) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		uid := strings.TrimPrefix(r.URL.Path, "/state/")

		game := app.GetGame(uid)
		json.NewEncoder(w).Encode(game)
	}
}
