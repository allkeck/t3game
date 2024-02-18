package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"t3game/internal/api"
	"t3game/internal/app"
	"time"
)

func main() {
	webHandler := http.FileServer(http.Dir("web/dist"))
	http.Handle("/", webHandler)
	http.Handle("/game", http.StripPrefix("/game", webHandler))

	gapp := app.NewGameApp()

	http.HandleFunc("/new-game", api.NewGameHandlerCreator(gapp))
	http.HandleFunc("/list-games", api.ListGamesHandlerCreator(gapp))

	// `/state/:uid`
	http.HandleFunc("/state", api.GameForUidHandlerCreator(gapp))

	// `/events/:uid`
	// http.HandleFunc("/events", )

	http.HandleFunc("/test", randomHandler)

	log.Fatal(http.ListenAndServe(":7000", nil))
}

func randomHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Content-Type", "text/event-stream")

	// send a random number every 2 seconds
	for {
		rand.Seed(time.Now().UnixNano())
		fmt.Fprintf(w, "data: %d \n\n", rand.Intn(100))
		w.(http.Flusher).Flush()
		time.Sleep(2 * time.Second)
	}
}
