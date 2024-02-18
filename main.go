package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"path"
	"strings"
	"t3game/internal/api"
	"t3game/internal/app"
	"time"
)

const (
	FSPATH = "web/dist/"
)

func main() {

	gapp := app.NewGameApp()

	http.HandleFunc("/new-game", api.NewGameHandlerCreator(gapp))
	http.HandleFunc("/list-games", api.ListGamesHandlerCreator(gapp))

	// `/state/:uid`
	http.HandleFunc("/state", api.GameForUidHandlerCreator(gapp))

	// `/events/:uid`
	http.HandleFunc("/events", api.EventsHandlerCreator(gapp))

	http.HandleFunc("/test", randomHandler)

	webHandler := http.FileServer(http.Dir(FSPATH))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// stolen from https://stackoverflow.com/a/64687181
		// If the requested file exists then return if; otherwise return index.html (fileserver default page)
		if r.URL.Path != "/" {
			fullPath := FSPATH + strings.TrimPrefix(path.Clean(r.URL.Path), "/")
			_, err := os.Stat(fullPath)
			if err != nil {
				if !os.IsNotExist(err) {
					panic(err)
				}
				// Requested file does not exist so we return the default (resolves to index.html)
				r.URL.Path = "/"
			}
		}
		webHandler.ServeHTTP(w, r)
	})

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
