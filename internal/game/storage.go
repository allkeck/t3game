package game

import (
	"log/slog"
	"sync"

	"github.com/google/uuid"
)

type (
	GameStorage interface {
		NewGame() Game
		ListGames() map[string]Game
		GetGame(uid string) Game
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
