import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import gamePlayReducers from './GameStore/GameState';
import playbackReducers from './PlaybackStore/PlaybackStore';

export const getStore = (gameType) => {
    const store = createStore(
        combineReducers({
            playbackState: playbackReducers,
            gameState: gamePlayReducers
        }),
        applyMiddleware(thunk)
    );

    return store;
};