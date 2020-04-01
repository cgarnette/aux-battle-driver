import React, {Component} from 'react';
import '../styles/settings.css';
import { timeout } from 'q';


export class Settings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            QuickMode: false,
            categories: this.props.categories || ['Prom Night', 'Last Dance', 'Childhood Guilty Pleasure'],
            playDuration: this.props.playDuration || 1
        };
    }

    onChange(e, property){
        e.preventDefault();
        console.log('setting property', property);
        console.log('to be', e.target.value);
        this.setState({[property]: e.target.value});
    }

    updateCategories(e, index){
        e.preventDefault();
        const categories = this.state.categories;
        categories[index] = e.target.value;
        this.setState({categories});
    }

    addCategory(e){
        e.preventDefault();
        const categories = this.state.categories;
        categories.push("");
        this.setState({categories});
    }

    removeCategory(e, index){
        e.preventDefault();
        const categories = this.state.categories;
        categories.splice(index, 1);
        this.setState({categories});
    }

    generateCategories(){
        const categories = this.state.categories;

        const categoryElements = categories.map((category, i) => {
            return (
                <li className="category-list-item-container">
                    <div className="category-list-item">
                        <input type="text" value={category} className="category-input" onChange={(e) => this.updateCategories(e, i)}/>
                        <div className="remove-btn-container" onClick={(e) => {this.removeCategory(e, i)}}><span className="remove-btn">-</span></div>
                    </div>
                </li>
                
            );
        });

        return (
            <div>
                <ul className="category-list">
                    {categoryElements}
                    
                </ul>
                <div className="settings-action-buttons">

                        <div className="--start-btn" onClick={(e) => this.addCategory(e)}>
                            <h4 style={{fontSize: '.9em'}} className="--start-title">+ Add Category</h4>
                        </div>

                        <div className="--start-btn" onClick={(e) => this.props.updateSettings(e, this.state)}>
                            <h3 className="--start-title">Update</h3>
                        </div>

                    </div>
            </div>
        );
    }

    render(){
        return (
            <div className="settings-container">
                <div className="--start-btn" onClick={(e) => this.props.updateSettings(e, this.state)}>
                    <h3 className="--start-title">Back</h3>
                </div>
                <h2 className="settings-title">Settings</h2>
                <div className="settings-radio-options-container">
                    <h3>Playback Duration</h3>
                    <input type="range" min="0" max="1" step=".01" value={this.state.playDuration} className="slider" id="myRange" onChange={(e) => this.onChange(e, "playDuration")}/>
                </div>
                <hr className="settings-divider"/>
                <h3 className="settings-categories-title">Categories</h3>
                <div className="settings-categories-container">
                    {this.generateCategories()}
                </div>
            </div>
        );
    }
}