package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"path"
	"regexp"
	"strings"
	"t3game/internal/api"
	"t3game/internal/app"
	"time"
)

const (
	FSPATH = "web/dist/"
)

type route struct {
	pattern *regexp.Regexp
	handler http.Handler
}

type RegexpHandler struct {
	routes []*route
}

func (h *RegexpHandler) Handler(pattern *regexp.Regexp, handler http.Handler) {
	h.routes = append(h.routes, &route{pattern, handler})
}

func (h *RegexpHandler) HandleFunc(pattern *regexp.Regexp, handler func(http.ResponseWriter, *http.Request)) {
	h.routes = append(h.routes, &route{pattern, http.HandlerFunc(handler)})
}

func (h *RegexpHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	for _, route := range h.routes {
		if route.pattern.MatchString(r.URL.Path) {
			route.handler.ServeHTTP(w, r)
			return
		}
	}
	// no pattern matched; send 404 response
	http.NotFound(w, r)
}

func main() {

	gapp := app.NewGameApp()

	router := RegexpHandler{}

	router.HandleFunc(regexp.MustCompile("/new-game"), api.NewGameHandlerCreator(gapp))
	router.HandleFunc(regexp.MustCompile("/list-games"), api.ListGamesHandlerCreator(gapp))

	// `/state/:uid`
	router.HandleFunc(regexp.MustCompile("/state/*"), api.GameForUidHandlerCreator(gapp))

	// `/events/:uid`
	router.HandleFunc(regexp.MustCompile("/events/*"), api.EventsHandlerCreator(gapp))

	router.HandleFunc(regexp.MustCompile("/turn"), api.TurnHandlerCreator(gapp))

	router.HandleFunc(regexp.MustCompile("/test"), randomHandler)

	webHandler := http.FileServer(http.Dir(FSPATH))
	router.HandleFunc(regexp.MustCompile("/"), func(w http.ResponseWriter, r *http.Request) {
		// stolen from https://stackoverflow.com/a/64687181
		// If the requested file exists then return if; otherwise return index.html (fileserver default page)
		if r.URL.Path != "/" {
			fullPath := FSPATH + strings.TrimPrefix(path.Clean(r.URL.Path), "/")
			log.Printf("fullPath: %s\n", fullPath)
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

	log.Fatal(http.ListenAndServe(":7000", &router))
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
