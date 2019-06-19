import * as actionTypes from '../actions/actionTypes';
import * as actionCreators from '../actions/actionCreators';


export const nextTrack = () => {
    return (dispatch) => {

    };
};

/**
 * A direct override of properties in the GameState.
 * @param {*} property 
 * @param {*} value 
 * @param {*} override 
 */
export const OverrideStore = (property, value, override) => {
    return (dispatch) => {
        dispatch(actionCreators.dataOverride({property, value, override}));
    };
};

