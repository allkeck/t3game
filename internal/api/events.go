package api

import (
	"fmt"
	"log/slog"
	"net/http"
	"strings"
	"t3game/internal/app"
)

type (
	sseMsg struct {
		event string
		data  string
		// id    int
	}
)

func EventsHandlerCreator(app *app.GameApp) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		logger := slog.With("op", "api:EventsHandler")

		uid := strings.TrimPrefix(r.URL.Path, "/events/")

		lobby, err := app.ConnectToLobby(uid)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		logger = logger.With("uid", uid)
		logger.Info("connected to lobby")

		flusher, ok := w.(http.Flusher)
		if !ok {
			http.Error(w, "Streaming unsupported!", http.StatusForbidden) // todo: proper error handling
			return
		}

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")
		w.Header().Set("Content-Type", "text/event-stream")
		w.WriteHeader(http.StatusOK)
		flusher.Flush()

		var msg sseMsg
	loop:
		for {
			select {
			case gm := <-lobby.Ch:
				logger.Info("got msg", "gm", gm)

				msg.from(gm)

				fmt.Fprint(w, msg)
				flusher.Flush()
			case <-r.Context().Done():
				app.PlayerDisconnected(uid, lobby.Side)
				break loop
			}
		}
		logger.Info("sse connection aborted")
	}

}

func (m sseMsg) String() string {
	if m.event != "" {
		return fmt.Sprintf("event: %s\ndata: %s\n\n", m.event, m.data)
	}
	return fmt.Sprintf("data: %s\n\n", m.data)
}

func (m *sseMsg) from(gm app.GameMsg) {
	m.event = gm.Event
	m.data = gm.Data
}
