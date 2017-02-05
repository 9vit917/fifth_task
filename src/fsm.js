class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config == undefined) {
            throw new Error('Config is undefined');
        }
        this.config = config;
        this._active_state = this.config.initial; 
        this._last_state = null;
        this._for_undo_undo = null;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() { 
        return this._active_state;
    }
    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.config.states[state]) {
            this._last_state = this._active_state
            this._active_state = state;
        }
        else
            throw new Error('State does not exist');
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */ 
    trigger(event) {
        var new_state = this.config.states[this._active_state].transitions[event];
        if (new_state) {
            this._last_state = this._active_state
            this._active_state = new_state;
        }
        else {
            throw new Error('Event for this state doesnt exist');
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this._last_state = null;
        this._active_state = this.config.initial; 
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (event == undefined) {
            return Object.keys(this.config.states);
        }
        var dict = this.config.states;
        var values = [];

        for (var state_key in dict) {
            var event_dict = dict[state_key].transitions;
            for (var event_key in event_dict) {
                if (event_key == event) {
                    values.push(state_key);
                    break;
                }
            }
        }

        return values;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if ( this._last_state == null) {
            return false;
        }
        else{
            this._for_undo_undo = this._active_state;
            this._active_state = this._last_state;
            this._last_state = null;
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this._for_undo_undo) {
            this._active_state = this._for_undo_undo;
            this._for_undo_undo = null;
            return true
        }
        else {
            return false
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._for_undo_undo = null;
        this._last_state = null;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
