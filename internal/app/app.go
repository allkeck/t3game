package app

import (
	"encoding/json"
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
		started    bool
	}

	GameMsg struct {
		Event string
		Data  string
		// Id    int
	}

	PlayerTurn struct {
		Uid     string `json:"uid"`
		XPlayer bool   `json:"xPlayer"`
		Row     int    `json:"row"`
		Col     int    `json:"col"`
	}

	LobbyNotFoundError struct {
		Uid string
	}

	Side uint8

	PlayerCh struct {
		Ch   chan GameMsg
		Side Side
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

func (app *GameApp) MakeTurn(pt PlayerTurn) error {
	if err := app.storage.MakeTurn(pt.Uid, pt.XPlayer, pt.Row, pt.Col); err != nil {
		return err
	}

	app.lmu.RLock()
	defer app.lmu.RUnlock()
	l, found := app.lobbys[pt.Uid]

	if !found {
		return LobbyNotFoundError{pt.Uid}
	}

	if !l.started {
		return ErrLobbyNotGoing
	}

	var ch chan GameMsg
	if pt.XPlayer {
		ch = l.oPlayer
	} else {
		ch = l.xPlayer
	}

	msg := turnGameMsg
	data, err := json.Marshal(pt)
	if err != nil {
		return err
	}
	msg.Data = string(data)

	ch <- msg

	return nil
}

func (app *GameApp) PlayerDisconnected(uid string, side Side) (err error) {
	logger := slog.With("op", "app:PlayerDisconnected", "uid", uid)

	app.lmu.Lock()
	defer app.lmu.Unlock()
	l, found := app.lobbys[uid]

	if !found {
		err = LobbyNotFoundError{uid}
		return
	}

	var ch chan GameMsg
	if side == XSide {
		l.xConnected = false
		ch = l.oPlayer
	} else if side == OSide {
		l.oConnected = false
		ch = l.xPlayer
	}
	logger.Info("player disconnected", "side", side.String())

	if l.isBothDisconnected() {
		delete(app.lobbys, uid)
		logger.Info("lobby deleted")
	} else {
		ch <- opponentDisconnectedGameMsg
		app.lobbys[uid] = l
	}

	return nil
}

func (app *GameApp) ConnectToLobby(uid string) (ch PlayerCh, err error) {
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
			ch.Side = XSide
			ch.Ch = l.xPlayer
		case 1:
			l.oConnected = true
			ch.Side = OSide
			ch.Ch = l.oPlayer
		}
	} else if l.oConnected {
		l.xConnected = true
		ch.Side = XSide
		ch.Ch = l.xPlayer
	} else if l.xConnected {
		l.oConnected = true
		ch.Side = OSide
		ch.Ch = l.oPlayer
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

func (l *lobby) isBothDisconnected() bool {
	return !l.xConnected && !l.oConnected
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

	l.started = true

	return nil
}

var (
	turnGameMsg = GameMsg{
		Event: "turn",
	}

	opponentDisconnectedGameMsg = GameMsg{
		Event: "disconnected",
	}

	startGameMsg = GameMsg{
		Event: "start",
	}
	startGameXPlayer = `{"xPlayer":true}`
	startGameOPlayer = `{"xPlayer":false}`

	ErrPlayersNotConnected     = fmt.Errorf("players not connected")
	ErrPlayersAlreadyConnected = fmt.Errorf("players already connected")
	ErrLobbyNotGoing           = fmt.Errorf("lobby not going")
)

const (
	XSide Side = iota
	OSide Side = iota
)

func (s *Side) String() string {
	if *s == XSide {
		return "X-Player"
	}
	if *s == OSide {
		return "O-Player"
	}
	panic(fmt.Sprintf("unkonwn Side value: %v", uint8(*s)))
}
