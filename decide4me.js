/**
 * Contructor for a new Spinner and its handler
 */
var Decide4Me = function(){
    
    // whether or not the spinner is spinning
    this.spinning = false;
    
    // Whether the mouse is dragging or not
    this.dragging = false;
    
    // The animation frame for the spinner
    this.animFrame = 0;
    
    // The canvas context for drawing on, but not showing
    this.ctx_buffer = document.createElement('canvas').getContext('2d');
    
    // The spinner canvas context
    this.ctx_spinner = document.createElement('canvas').getContext('2d');
    
    // The options container
    this.weights = {};
    
    // The number of options
    this.size = 0;
    
    // The angle for the spinner to approach
    this.newAngle = 0;
    
};



/**
 * Initialize the decision spinner inside of a parent
 * 
 * param parent {element}
 */
Decide4Me.prototype.addTo = function(parent){
    // add the spinner to the parent
}



/**
 * Add a new option to the spinner
 *
 * param option {String}
 */
Decide4Me.prototype.addOption = function(option){
    // add the new option
    // update size
    // redraw
}



/**
 * Remove an option from the spinner
 * 
 * param option {String}
 */
Decide4Me.prototype.removeOption = function(option){
    // find option
    // remove it
    // update size
    // redraw
}



/**
 * Fill the spinner with a new set of option
 * 
 * param options {List}
 */
Decide4Me.prototype.newOptions = function(options){
    // add the options and assign it's weight
    // update size
}



/**
 * Changes the weighting of an option
 *
 * param option {String} The option to change the weight of
 * param weight {Float} The weight to assign to the option
 */
Decide4Me.prototype.weightOption = function(option, weight){
    // find the option
    // change it's weight
}



/**
 * Draws a new background to the buffer and saves it as the canvas' background
 */
Decide4Me.prototype.updateBg = function(){
    // clear buffer
    // draw new background on buffer
    // slices are just relative sizes
    // save buffer toDataUrl
    // set spinner canvas bg to buffer data
}



/**
 * Produces a new option datastructure
 *
 * param name {String}  The name of the option
 *
 * return {option}  something like [name, weight]
 */
Decide4Me.prototype.createOption = function(name){
    // weights are always 1 on initialization
    return [name, 1];
}



/**
 * Get option from the spinner
 *
 * return {String}  The name of the option
 */
Decide4Me.prototype.getRandOption = function(){
    // selects options with a distribution corresponding to the weights relative to the number of options
}



/**
 * Spin the spinner to a given option
 *
 * param option {String}  The name of the option to spin to
 */
Decide4Me.prototype.spinTo = function(option){
    // find the option
    // find the angle range
    // select a value within the range
}



/**
 * Main tick for the spinning animation
 */
Decide4Me.prototype.spinTick = function(){
    // initial spinning until you've gone around enough
    // slow down (linear/cosine) till you get to the determined angle (newAngle)
    //   this can be initiated at a newAngle-Pi threshold after initial spinning
}



/**
 * Handles when the mouse is clicked
 *
 * param e {MouseEvent}  The mouse event holding the data about the mouse
 */
Decide4Me.prototype.onMouseDown = function(e){
    this.dragging = true;
}



/**
 * Handles when the mouse is unclicked
 *
 * param e {MouseEvent}  The mouse event holding the data about the mouse
 */
Decide4Me.prototype.onMouseUp = function(e){
    this.dragging = false;
}



/**
 * Handles when the mouse is moved
 *
 * param e {MouseEvent}  The mouse event holding the data about the mouse
 */
Decide4Me.prototype.onMouseMove = function(e){
    if (!this.spinning && this.dragging) {
        // adjust the weights
    }
}

/**
 * Returns the number of options
 *
 * return {Number}
 */
Decide4Me.prototype.getSize = function(){
    return this.size;
}