import {AUX_BATTLE_SERVER} from '../constants';


export const searchSpotify = (search, roomCode, explicit) => {
    // console.log("explicit", explicit);
    const url = explicit ? `${AUX_BATTLE_SERVER}/spotify/search?searchParam=${search}&roomCode=${roomCode}&explicit=${explicit}` :
        `${AUX_BATTLE_SERVER}/spotify/search?searchParam=${search}&roomCode=${roomCode}`;
        
    return fetch(url).then(response => 
        response.json().then(data => {
            return data.tracks ? data.tracks.items : []; 
        }));
};

export const setTrackSelection = (track, playerId, roomCode) => {
    if (track && playerId && roomCode) {
        return fetch(`${AUX_BATTLE_SERVER}/battle/set_player_track`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                track,
                playerId,
                roomCode
            })
        }).then(response => response.json());
    }
    return {error: "error"};
};

export const updateSettings = (roomCode, settings) => {
    if(roomCode && settings) {
        return fetch(`${AUX_BATTLE_SERVER}/settings`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                settings,
                roomCode
            })
        }).then(response => response.json());
    }
    return {error: "error"};
};

export const getAuxKeepers = (roomCode) => {
    return fetch(`${AUX_BATTLE_SERVER}/battle/aux_keepers?roomCode=${roomCode}`).then(response => response.json());
}

export const castVote = (roomCode, keeper) => {
    // console.log("castingVote", roomCode, keeper);
    return fetch(`${AUX_BATTLE_SERVER}/vote?roomCode=${roomCode}&keeperId=${keeper.id}`).then(response => response.json());
}

export const updateUser = (roomCode, state) => {
    if(roomCode && state) {
        return fetch(`${AUX_BATTLE_SERVER}/update/user`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                state,
                roomCode
            })
        });
    }
    return { error: "error" };
}

export const submitCategory = (roomCode, category) => {
    return fetch(`${AUX_BATTLE_SERVER}/category/submit?roomCode=${roomCode}&category=${category}`).then(response => response.json());
}

export const startTrackSelection = (roomCode) => {
    return fetch(`${AUX_BATTLE_SERVER}/freeforall/trackselect?roomCode=${roomCode}`).then(response => response.json());
}

export const closeJoinPhase = (roomCode) => {
    return fetch(`${AUX_BATTLE_SERVER}/join/close?roomCode=${roomCode}`).then(response => response.json());
}

export const startPlaybackRound = (roomCode) => {
    return fetch(`${AUX_BATTLE_SERVER}/start/roundplay?roomCode=${roomCode}`).then(response => response.json());
}

export const endVotePhase = (roomCode) => {
    return fetch(`${AUX_BATTLE_SERVER}/vote/close?roomCode=${roomCode}`).then(response => response.json());
}
// export const getNextTrack = (roomCode, id) => {

//     console.log("need next now");
//     if (roomCode) {
//         fetch(`${AUX_BATTLE_SERVER}/party/next`, {
//             method: 'post',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 id,
//                 roomCode
//             })
//         });
//     }
// };

export const addToQueue = (roomCode, track) => {
    if (roomCode && track) {
        return fetch(`${AUX_BATTLE_SERVER}/party/add`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                track: track.uri,
                roomCode
            })
        }).then(response => response.json());
    }

    return {error: "error"};
};