import * as actionTypes from '../actions/actionTypes';
import * as actionCreators from '../actions/actionCreators';

const defaultState = {};

const gamePlayReducers = (state=defaultState, action) => {

    console.log("action", action);
    switch (action.type) {
        case actionTypes.DATA_OVERRIDE:
            if (action.res.override) {
                return {
                    ...state,
                    ...action.res.property
                };
            }
            return {
                ...state,
                [action.res.property]: action.res.value
            };
            break;
        case actionTypes.CLEAR_TRACK_URI:
            return {
                ...state,
                trackURI: ""
            };
            break;
        default: 
            return state;
            break;
    }
}



export default gamePlayReducers;