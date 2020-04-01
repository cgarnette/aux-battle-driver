import React, {Component} from 'react';
import Confetti from 'react-confetti'

export class Round extends Component {
    constructor(props){
        super(props)
    }

    template = (child, confetti) => {
        const height = window.innerHeight;
        const width = window.innerWidth;
        return (
                <div className={"intro-screen"}>
                    {confetti && <Confetti width={width} height={height}/>}
                    <div className="game-round-info-container">
                        <div className="game-round-info">
                            <div className="round-count">
                                {this.props.roundNum && `Round ${this.props.roundNum}`}
                            </div>
                            <div className="category-display">
                                {this.props.category || ""}
                            </div>
                        </div>
                    </div>
                    {child}
                </div>
        );
    }


    currentlyPlaying = () => {
        const { position, duration, playDuration } = this.props;
        const currentPosition = (position/(duration * playDuration)) * 100; 
        
        return (
            <div>
                <div className="battler-track">
                    <div className="battler-track-art" style={{backgroundImage: `url(${this.props.albumArt})`}}>
                        <div className="record-center-conatiner">
                            <div className="record-center"/>
                        </div>
                    </div>
                    <div className="battler-track-details">
                        { this.props.currentBattler && <div style={{margin: '1em'}}>
                            <span className="battler-track-battler-info">{`On the Aux: ${this.props.currentBattler}`}</span>
                        </div> }
                        <div style={{margin: '1em', marginTop: ".2em"}}>
                            <span className="battler-track-battler-info">{`Track: ${this.props.track || "Track1"}`}</span>
                        </div>
                        <div style={{margin: '1em', marginTop: ".2em"}}>
                            <span className="battler-track-battler-info">{`Album: ${this.props.album || "Album1"}`}</span>
                        </div>
                        <div style={{margin: '1em', marginTop: ".2em"}}>
                            <span className="battler-track-battler-info">{`Artist: ${this.props.artist || "Artist1"}`}</span>
                        </div>
                    </div>

                </div>
                <div className="track-progress-bar">
                    <div className="progress" style={{width: `${currentPosition < 98 ? currentPosition : 98}%`}}/>
                </div>
            </div>
        );
    };

    roundWinner = () => {
        return (
            <div className="round-winner-container">
                <div className="round-winner-title">
                    <h1>This Round Goes To:</h1> 
                    
                </div>
                <div className="round-winner">
                    <div className="round-winner-track" style={{backgroundImage: `url(${this.props.albumArt || ""})`}}/>
                </div>
                <h2 className="round-winner-username">{this.props.winner || "blank3"}</h2>
            </div>
        );
    };

    gameWinner = () => {
        return (
            <div className="round-winner-container">
                <div className="round-winner-title">
                    <h1>Aux Battle Champion</h1> 
                </div>
                <div className="round-winner">
                    <div className="round-winner-track" style={{backgroundImage: `url(${this.props.albumArt || ""})`}}/>
                </div>
                <h2 className="round-winner-username">{this.props.winner || "blank3"}</h2>
            </div>
        );
    };

    displaySwitch(){
        switch(this.props.round){
            case "play":
                return (
                    <div>
                        <div className="background" style={{backgroundImage: `url(${this.props.albumArt})`}}/>
                        {this.template(this.currentlyPlaying())}
                    </div>
                );
            case "roundWinner":
                if(this.props.preview && !this.previewPlayer) {
                    this.previewPlayer = new Audio(this.props.preview);
                    this.previewPlayer.play();
                }
                return (
                    <div>
                        <div className="background" style={{backgroundImage: `url(${this.props.albumArt})`}}/>
                        {this.template(this.roundWinner(), true)}
                    </div>
                ); 
            case "gameWinner":
                if(this.props.preview && !this.previewPlayer) {
                    this.previewPlayer = new Audio(this.props.preview);
                    this.previewPlayer.play();
                }
                return (
                    <div>
                        <div className="background" style={{backgroundImage: `url(${this.props.albumArt})`}}/>
                        {this.template(this.gameWinner(), true)}
                    </div>
                ); 
            default:
        }
    }

    componentWillUnmount(){
        if (this.previewPlayer) {
            this.previewPlayer.pause();
        }   
    }

    render(){
        const round = this.props.round;
        return (
            <div>
                {this.displaySwitch(round)}
            </div>
        );
    }
}