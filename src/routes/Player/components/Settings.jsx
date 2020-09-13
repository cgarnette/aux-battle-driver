import React, {Component} from 'react';
import '../styles/settings.css';
import { timeout } from 'q';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import { defaultSettings } from '../../../util/constants';


export class Settings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ...this.props.settings
        };
    }

    onChangeSlider(e, property){
        e.preventDefault();
        this.setState({[property]: e.target.value});
    }

    changeToggle(e, property) {
        e.preventDefault();
        this.setState({ [property]: !this.state[property] });
    }

    changeValue(e, property, value) {
        if (value < 0) {
            return this.setState({ [property]: 0 });
        }
        return this.setState({ [property]: value });
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
        const categoryElements = this.state.categories.map((category, i) => {
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

                    </div>
            </div>
        );
    }

    restoreDefaults() {
        this.setState({
            playDuration: defaultSettings.playDuration,
            numDJs: defaultSettings.numDJs,
            timeToSelect: defaultSettings.timeToSelect, 
            timeToVote: defaultSettings.timeToVote, 
            numRounds: defaultSettings.numRounds, 
            timedSelection: defaultSettings.timedSelection, 
            timedVoting: defaultSettings.timedVoting,
            timedCats: defaultSettings.timedCats,
            timeToSubmitCat: defaultSettings.timeToSubmitCat,
            categorySelector: defaultSettings.categorySelector, // either host or judges
            categories: defaultSettings.categories
        });
    }

    btnSelectedStyle (btnLabel) {
        const selectedChoiceStyle = { backgroundColor: 'mediumseagreen', border: "1px solid white" };
        return this.state.categorySelector === btnLabel ? selectedChoiceStyle : {};
    }

    render(){
        
        const { playDuration, numDJs, timeToSelect, timeToVote, numRounds, timedSelection, timedVoting, categorySelector, timedCats, timeToSubmitCat } = this.state;
        return (
            <>
            <div className="settings-container">
                <h2 className="settings-title">Settings</h2>
                <div className="settings-radio-options-container">
                    <h3>Playback Duration</h3>
                    <input type="range" min="0" max="1" step=".01" value={playDuration} className="slider" id="myRange" onChange={(e) => this.onChangeSlider(e, "playDuration")}/>
                </div>
                <hr className="settings-divider"/>
                <div className="settings-radio-options-container">
                    <h3 style={{ marginBottom: 0 }}>Number of Competitors</h3>
                    <div className="num-player-setting">
                        <div className="inc-btn-container" onClick={(e) => this.changeValue(e, 'numDJs', numDJs - 1)}><span className="dec-btn">-</span></div>
                        <h1>{numDJs}</h1>
                        <div className="inc-btn-container" onClick={(e) => this.changeValue(e, 'numDJs', numDJs + 1)}><span className="inc-btn">+</span></div>
                    </div>
                </div>
                <hr className="settings-divider"/>
                <div className="settings-switch-options-container">
                    <h3>Timed Song Selection</h3>
                    <div className="switch-container">
                        <Switch
                            checked={timedSelection}
                            onChange={(e) => this.changeToggle(e, 'timedSelection')}
                            name="timed-voting"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    </div>
                </div>

                {timedSelection && <>
                    <hr className="settings-divider"/>
                    <div className="settings-radio-options-container">
                        <h3>Time to Select Song</h3>
                        <div className="num-player-setting">
                            <div className="inc-btn-container" onClick={(e) => this.changeValue(e, 'timeToSelect', timeToSelect - 1)}><span className="dec-btn">-</span></div>
                            <h1>{timeToSelect}</h1>
                            <div className="inc-btn-container" onClick={(e) => this.changeValue(e, 'timeToSelect', timeToSelect + 1)}><span className="inc-btn">+</span></div>
                        </div>
                    </div>
                </>}

                <hr className="settings-divider"/>
                <div className="settings-switch-options-container">
                    <h3>Timed Voting</h3>
                    <div className="switch-container">
                        <Switch
                            checked={timedVoting}
                            onChange={(e) => this.changeToggle(e, 'timedVoting')}
                            name="timed-voting"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    </div>
                </div>
                {timedVoting && <>
                    <hr className="settings-divider"/>
                    <div className="settings-radio-options-container">
                        <h3>Time To Cast Vote</h3>
                        <div className="num-player-setting">
                            <div className="inc-btn-container" onClick={(e) => this.changeValue(e, 'timeToVote', timeToVote - 1)}><span className="dec-btn">-</span></div>
                            <h1>{timeToVote}</h1>
                            <div className="inc-btn-container" onClick={(e) => this.changeValue(e, 'timeToVote', timeToVote + 1)}><span className="inc-btn">+</span></div>
                        </div>
                    </div>
                </>}
                <hr className="settings-divider"/>
                <div className="settings-radio-options-container">
                    <h3>Who Selects Categories</h3>
                    <div className="btn-choice-container">
                        <div className="btn-choice" style={this.btnSelectedStyle('host')} onClick={(e) => this.changeValue(e, 'categorySelector', 'host')}>
                                <h4 style={{fontSize: '.9em'}} className="--start-title">Host</h4>
                        </div>
                        <div className="btn-choice" style={this.btnSelectedStyle('judges')} onClick={(e) => this.changeValue(e, 'categorySelector', 'judges')}>
                            <h4 style={{fontSize: '.9em'}} className="--start-title">Judges</h4>
                        </div>
                    </div>
                </div>
                {categorySelector === 'judges' && <>
                    <hr className="settings-divider"/>
                    <div className="settings-switch-options-container">
                        <h3>Timed Category Submissions</h3>
                        <div className="switch-container">
                            <Switch
                                checked={timedCats}
                                onChange={(e) => this.changeToggle(e, 'timedCats')}
                                name="timed-categories"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                        </div>
                    </div>
                    {timedCats && <>
                        <hr className="settings-divider"/>
                        <div className="settings-radio-options-container">
                            <h3>Time To Submit Category</h3>
                            <div className="num-player-setting">
                                <div className="inc-btn-container" onClick={(e) => this.changeValue(e, 'timeToSubmitCat', timeToVote - 1)}><span className="dec-btn">-</span></div>
                                <h1>{timeToSubmitCat}</h1>
                                <div className="inc-btn-container" onClick={(e) => this.changeValue(e, 'timeToSubmitCat', timeToVote + 1)}><span className="inc-btn">+</span></div>
                            </div>
                        </div>
                    </>}
                    <hr className="settings-divider"/>
                    <div className="settings-radio-options-container">
                        <h3>Number of Rounds</h3>
                        <div className="num-player-setting">
                            <div className="inc-btn-container" onClick={(e) => this.changeValue(e, 'numRounds', numRounds - 1)}><span className="dec-btn">-</span></div>
                            <h1>{numRounds}</h1>
                            <div className="inc-btn-container" onClick={(e) => this.changeValue(e, 'numRounds', numRounds + 1)}><span className="inc-btn">+</span></div>
                        </div>
                    </div>
                </>}
                {categorySelector === 'host' && <>
                    <hr className="settings-divider"/>
                    <h3 className="settings-categories-title">Categories</h3>
                    <div className="settings-categories-container">
                        {this.generateCategories()}
                    </div>
                </>}

                </div>
                <div className="nav-buttons">
                    <div className="nav-btn" onClick={ () => this.props.cancel()}>
                        <span className="nav-btn-text"> Cancel </span>
                    </div>
                    <div className="nav-btn" onClick={() => this.restoreDefaults()}>
                        <span className="nav-btn-text" style={{ fontSize: '.9em' }}> Restore Defaults </span>
                    </div>
                    <div className="nav-btn">
                        <span className="nav-btn-text" onClick={(e) => this.props.updateSettings(e, this.state)}> Next </span>
                    </div>
                </div>
            </>
        );
    }
}