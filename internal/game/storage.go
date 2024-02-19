package game

import (
	"fmt"
	"log/slog"
	"sync"

	"github.com/google/uuid"
)

type (
	GameStorage interface {
		NewGame() Game
		ListGames() map[string]Game
		GetGame(uid string) Game
		MakeTurn(uid string, xPlayer bool, row, col int) error
	}
	storageImpl struct {
		sync.RWMutex
		games map[string]Game
	}
	Game struct {
		Uid   string
		State []string
	}
)

const (
	emptyVal = "e"
	xVal     = "x"
	oVal     = "o"

	boardSize = 3
)

var (
	ErrGameNotFound = fmt.Errorf("game not found")
)

func InitStorage() GameStorage {
	logger := slog.With("op", "game:InitStorage")
	logger.Info("initializing storage")
	ret := &storageImpl{}
	ret.games = make(map[string]Game)
	return ret
}

func (s *storageImpl) NewGame() Game {
	uid := uuid.New().String()
	game := Game{
		Uid: uid,
		State: []string{
			emptyVal, emptyVal, emptyVal,
			emptyVal, emptyVal, emptyVal,
			emptyVal, emptyVal, emptyVal},
	}

	s.Lock()
	s.games[uid] = game
	s.Unlock()

	return game
}

func (s *storageImpl) MakeTurn(uid string, xPlayer bool, row, col int) error {
	normalPos := row*boardSize + col
	s.Lock()
	defer s.Unlock()

	game, found := s.games[uid]
	if !found {
		return ErrGameNotFound
	}

	if xPlayer {
		game.State[normalPos] = xVal
	} else {
		game.State[normalPos] = oVal
	}

	return nil
}

func (s *storageImpl) ListGames() map[string]Game {
	s.RLock()
	defer s.RUnlock()
	return s.games
}

func (s *storageImpl) GetGame(uid string) Game {
	s.RLock()
	defer s.RUnlock()
	return s.games[uid]
}
