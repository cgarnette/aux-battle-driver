import React, {Component} from 'react';
import '../styles/settings.css';
import { timeout } from 'q';


export class Settings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            QuickMode: false,
            categories: this.props.categories || ['Prom Night', 'Last Dance', 'Childhood Guilty Pleasure']
        };
    }

    onChange(e, property){
        e.preventDefault();
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
                        <input type="text" value={category} onChange={(e) => this.updateCategories(e, i)}/>
                        <button onClick={(e) => {this.removeCategory(e, i)}}>X</button>
                    </div>
                </li>
                
            );
        });

        return (
            <div>
                <ul className="category-list">
                    {categoryElements}
                    <div className="settings-action-buttons">
                        <button className="add-category-btn" onClick={(e) => this.addCategory(e)}> + Add Category</button>
                        <button 
                            className="settings-update-btn" 
                            onClick={(e) => this.props.updateSettings(e, this.state)}>
                            Update
                        </button>
                    </div>
                </ul>
            </div>
        );
    }

    render(){
        return (
            <div className="settings-container">
                <button className="settings-back-btn" onClick={() => this.props.goBack()}> Back </button>
                <h2 className="settings-title">Settings</h2>
                <div className="settings-radio-options-container">
                    <h3>Quick Mode</h3>
                    <input className="settings-mode-selector" type="checkbox" onClick={(e) => this.onChange(e, "QuickMode")}/>
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