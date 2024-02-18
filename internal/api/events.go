package api

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
	"t3game/internal/app"
)

type (
	EventsState struct {
		sync.RWMutex
		connections map[string]lobby
	}
	lobby struct {
		xPlayer *http.ResponseWriter
		oPlayer *http.ResponseWriter
	}

	sseMsg struct {
		event string
		data  string
		// id    int
	}
)

var (
	state = EventsState{
		connections: make(map[string]lobby),
	}
)

func EventsHandlerCreator(app *app.GameApp) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		uid := strings.TrimPrefix(r.URL.Path, "/events/")
		log.Printf("api:events handler %s\n", uid)
		var l lobby
		var exists bool
		state.Lock()
		defer state.Unlock()
		if l, exists = state.connections[uid]; !exists {
			state.connections[uid] = lobby{}
		}

		if l.isFull() {
			w.WriteHeader(http.StatusConflict)
			w.Write([]byte("players already connected"))
			return
		}

		_ = l.addPlayer(&w)

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")
		w.Header().Set("Content-Type", "text/event-stream")

		if l.isFull() {
			msg := sseMsg{
				event: "start",
				data:  "{xPlayer:false}",
			}
			fmt.Fprint(*l.oPlayer, msg)
			(*l.oPlayer).(http.Flusher).Flush()

			msg.data = "{xPlayer:true}"
			fmt.Fprint(*l.xPlayer, msg)
			(*l.xPlayer).(http.Flusher).Flush()
		}
	}
}

func (m sseMsg) String() string {
	if m.event != "" {
		return fmt.Sprintf("event: %s\ndata: %s\n\n", m.event, m.data)
	}
	return fmt.Sprintf("data: %s\n\n", m.data)
}

func (l *lobby) addPlayer(w *http.ResponseWriter) (isXPlayer bool) {
	if l.oPlayer != nil && l.xPlayer == nil {
		l.xPlayer = w
		isXPlayer = true
		return
	}

	if l.oPlayer == nil && l.xPlayer != nil {
		l.oPlayer = w
		return
	}

	return
}

func (l lobby) isFull() bool {
	return l.oPlayer != nil && l.xPlayer != nil
}
