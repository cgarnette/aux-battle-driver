import * as actionTypes from './actionTypes';

export const dataOverride = (data) => {
    console.log("data to override", data);
    return { type: actionTypes.DATA_OVERRIDE, res: data };
}

export const setCurrentTrackAction = (currentTrack) => {
    console.log("Current Track Info", currentTrack);
    return { type: actionTypes.SET_CURRENT_TRACK, res: currentTrack };
}

export const clearTrackURIAction = () => {
    return { type: actionTypes.CLEAR_TRACK_URI };
}

export const setDeviceIdAction = (deviceId) => {
    return { type: actionTypes.SET_DEVICE_ID, res: deviceId };
}

export const setPlayerIdAction = (playerId) => {
    return { type: actionTypes.SET_PLAYER_ID, res: playerId };
}