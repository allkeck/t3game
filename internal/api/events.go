package api

import (
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

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
