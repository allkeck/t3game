package app

import (
	"fmt"
	"log/slog"
	"math/rand"
	"sync"
	"t3game/internal/game"
)

type (
	GameApp struct {
		storage game.GameStorage

		lmu    sync.RWMutex
		lobbys map[string]lobby
	}

	lobby struct {
		xPlayer    chan GameMsg
		xConnected bool
		oPlayer    chan GameMsg
		oConnected bool
	}

	GameMsg struct {
		Event string
		Data  string
		// Id    int
	}

	LobbyNotFoundError struct {
		Uid string
	}
)

func NewGameApp() *GameApp {
	return &GameApp{
		storage: game.InitStorage(),
		lobbys:  make(map[string]lobby),
	}
}

func (app *GameApp) NewGame() game.Game {
	g := app.storage.NewGame()
	app.newLobby(g.Uid)
	return g
}

func (app *GameApp) ConnectToLobby(uid string) (ch chan GameMsg, err error) {
	logger := slog.With("op", "app:ConnectToLobby", "uid", uid)

	app.lmu.Lock()
	defer app.lmu.Unlock()
	l, found := app.lobbys[uid]

	if !found {
		err = LobbyNotFoundError{uid}
		return
	}

	if l.isBothConnected() {
		err = ErrPlayersAlreadyConnected
		return
	}

	if !(l.oConnected || l.xConnected) {
		switch rand.Intn(2) {
		case 0:
			l.xConnected = true
			ch = l.xPlayer
		case 1:
			l.oConnected = true
			ch = l.oPlayer
		}
	} else if l.oConnected {
		l.xConnected = true
		ch = l.xPlayer
	} else if l.xConnected {
		l.oConnected = true
		ch = l.oPlayer
	} else {
		err = ErrPlayersAlreadyConnected
		return
	}

	if l.isBothConnected() {
		l.startGame()
		logger.Info("game started")
	}

	app.lobbys[uid] = l
	return
}

func (app *GameApp) ListGames() map[string]game.Game {
	return app.storage.ListGames()
}

func (app *GameApp) GetGame(uid string) game.Game {
	return app.storage.GetGame(uid)
}

func (e LobbyNotFoundError) Error() string {
	return fmt.Sprintf("lobby not found: %s", e.Uid)
}

func (app *GameApp) newLobby(uid string) {
	app.lmu.Lock()
	defer app.lmu.Unlock()

	l := lobby{
		oPlayer: make(chan GameMsg, 1),
		xPlayer: make(chan GameMsg, 1),
	}
	app.lobbys[uid] = l
}

func (l *lobby) isBothConnected() bool {
	return l.xConnected && l.oConnected
}

func (l *lobby) startGame() error {
	if !l.isBothConnected() {
		return ErrPlayersNotConnected
	}

	msg := startGameMsg
	msg.Data = startGameOPlayer
	l.oPlayer <- msg

	msg.Data = startGameXPlayer
	l.xPlayer <- msg

	return nil
}

var (
	startGameMsg = GameMsg{
		Event: "start",
	}
	startGameXPlayer = `{"xPlayer":true}`
	startGameOPlayer = `{"xPlayer":false}`

	ErrPlayersNotConnected     = fmt.Errorf("players not connected")
	ErrPlayersAlreadyConnected = fmt.Errorf("players already connected")
)
