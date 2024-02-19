package api

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"t3game/internal/app"
)

type ()

func TurnHandlerCreator(gapp *app.GameApp) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		logger := slog.With("op", "api:TurnHandler")

		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusNotAcceptable)
			w.Write([]byte("only POST allowed"))
			return
		}

		decoder := json.NewDecoder(r.Body)
		var pt app.PlayerTurn
		err := decoder.Decode(&pt)
		if err != nil {
			w.WriteHeader(http.StatusNotAcceptable)
			w.Write([]byte(fmt.Sprintf("wrong body: %v", err)))
		}

		logger.Info("turn received", "player-turn", pt)

		if err := gapp.MakeTurn(pt); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(fmt.Sprintf("service level err: %v", err)))
			return
		}
	}
}
