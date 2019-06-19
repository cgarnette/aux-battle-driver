import * as actionTypes from '../actions/actionTypes';
import * as actionCreators from '../actions/actionCreators';

const defaultState = {
    currentTrack: {},
};

const playbackReducers = (state=defaultState, action) => {

    console.log('action', action);
    switch (action.type) {
        case actionTypes.SET_CURRENT_TRACK:
            return {
                ...state,
                currentTrack: { ...action.res },
            }
            break;
        case actionTypes.SET_DEVICE_ID:
            return {
                ...state,
                deviceId: action.res
            }
            break;
        case actionTypes.SET_PLAYER_ID:
            return {
                ...state,
                playerId: action.res
            }
        default:
            return state;
            break;
    }
}



export default playbackReducers;