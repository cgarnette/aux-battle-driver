import React, {Component} from 'react';



export class Round extends Component {
    constructor(props){
        super(props)
    }


    render(){

        return (
            <div className="intro-screen">
                <div className="round-count">
                    {`Round ${this.props.round || "1"}`}
                </div>
                <div className="category-display" style={{marginTop: ".4em"}}>
                    {this.props.category || "Closing Time Jam"}
                </div>
            </div>
        );
    }
}