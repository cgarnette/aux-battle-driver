import * as actionTypes from '../actions/actionTypes';
import * as actionCreators from '../actions/actionCreators';


export const setCurrentTrack = (currentTrack) => {
    console.log("set current track action", currentTrack);
    return (dispatch) => {
        dispatch(actionCreators.setCurrentTrackAction(currentTrack));
        dispatch(actionCreators.clearTrackURIAction());
    };
};

export const setDeviceId = (deviceId) => {
    return (dispatch) => {
        dispatch(actionCreators.setDeviceIdAction(deviceId));
    }
}

export const setPlayerId = (playerId) => {
    return (dispatch) => {
        dispatch(actionCreators.setPlayerIdAction(playerId));
    }
}

