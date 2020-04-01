import React, {Component} from 'react';
import '../styles/trackSearch.css';
import {Icon, Button} from 'semantic-ui-react'
import * as _ from "lodash";

import {searchSpotify, setTrackSelection, addToQueue} from '../../../util/api/apiHelper';

export class TrackSearch extends Component {
    constructor(props){
        super(props);

        this.state = {
            searchResults: [],
            category: this.props.category || "",
            selectedTrack: {},
            roomCode: this.props.roomCode
        }
    }

    async onChange (e){
        e.preventDefault();

        const searchResults = await searchSpotify(e.target.value, this.state.roomCode, false);

        this.setState({searchResults});
    }

    isSelected(item) {
        return item.id === this.state.selectedTrack.id
    }

    setSelected(item) {

        console.log("selected: ", item);
        if (this.isSelected(item)) {
            this.setState({selectedTrack: {}});
        } else {
            this.setState({selectedTrack: item});
        }
    }

    displayResults(){
        const resultList = this.state.searchResults.map(result => {
            
            const className = !this.isSelected(result) ? "result-item" : "result-item-selected";
            const url = result.album ? (result.album.images.length > 0 ? result.album.images[1 || 0].url : undefined) : undefined;
            const artist = result.artists ? result.artists[0].name : "";
            return (
            <li className={className} key={result && result.uri} onClick={() => this.setSelected(result)}>
                <div className="result">
                    <div>
                        {url && <img className="result-artist-image" src={url}/>}
                    </div>
                    <div className="result-track-name-container">
                        <h4 className="result-track-name">{result.name}</h4>
                        <span className="result-artist-name">{artist}</span>
                        {result.explicit && 
                        <div className="result-track-explicit">
                            <div className="result-track-explicit-marker"/>
                            <span className="result-track-explicit-label">Explicit</span>
                        </div>
                        }
                    </div>
                </div>
            </li>
        )});

        const length = !_.isEmpty(this.state.selectedTrack) ? "result-list short" : "result-list";

        return (
            <div className="result-list-container">
                <nav>
                    <ul className={length}>
                        {resultList}
                    </ul>
                </nav>
            </div>
        );
    }

    async submitSelection(){

        let result;
        if (this.props.roomType === "party") {
            result = await addToQueue(this.props.roomCode, this.state.selectedTrack);
        } else if (this.props.roomType === "battle") {
            result = await setTrackSelection(this.state.selectedTrack, this.props.playerId, this.props.roomCode);
        }

        if (result.success) {
            if (this.props.roomType === "battle") {
                this.props.submissionSuccessful();
            } else {
                this.setState({successful: true});
                setTimeout(() => this.setState({successful: false}), 5000);
            }
        }
    }

    selectionDisplay() {
        const { selectedTrack } = this.state;
        const url = selectedTrack.album ? (selectedTrack.album.images.length > 0 ? selectedTrack.album.images[1 || 0].url : undefined) : undefined;
        const artist = selectedTrack.artists ? selectedTrack.artists[0].name : "";
        return (
            <div className="track-selection-render">
                <div className="divider-container divider-conditional">
                    <hr className="--divider"/>
                </div>
                <div className="details-container">
                    <div className="selected-track-display">
                        <img className="selection-display-image" src={url}/>
                        <div className="selected-track-details">
                            <b>{selectedTrack.name}</b>
                            <div className="selected-track-artist">
                                {artist}
                            </div>
                        </div>
                    </div>
                    <div className="play-btn-container" onClick={() => this.submitSelection()}>
                        <Icon name="play circle" size="huge"/>
                        <b style={{ marginTop: ".5em" }}>Play</b>
                    </div>
                </div>
            </div>
        );
    }
    
    render(){
        return (
            <div>
                <div className="track-search-background"/>
                {this.state.successful && <div className="successful-add"><h3 className="success-message">Success</h3></div>}
                <div className="track-search-container">
                    <div className="header-container">
                        <div className="action-bar">
                            <div className="category-container">
                                <h2>{this.state.category || ""}</h2>
                            </div>
                        </div>
                        <div className="search-bar-container">
                            <Icon name="search" className="search-icon"/>
                            <input type="text" className="search-bar" onChange={(e) => this.onChange(e)}/>
                        </div>
                        <div className="divider-container">
                            <hr className="--divider"/>
                        </div>
                    </div>

                    <div className="test-holder">
                        {this.displayResults()}
                        {!_.isEmpty(this.state.selectedTrack) && this.selectionDisplay()}
                    </div> 
                </div>
            </div>
        );
    }
}