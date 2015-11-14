// force image to load so we have the resource
(function(){
    var i = new Image();
    i.src = "arrow.jpg";
})()
/**
 * Contructor for a new Spinner and its handler
 */
var Decide4Me = function(){
    
    // Variables are private to the class, so getters/setters are necesarry
    
    // whether or not the spinner is spinning
    var spinning = false;
    
    // Whether the mouse is dragging or not
    var dragging = false;
    
    // The animation frame for the spinner
    var animFrame = 0;
    
    // The height of the canvases
    var height = 400;
    
    // The width of the canvases (should be a square)
    var width = 400;
    
    // The radius of the circle for the spinner
    var radius = 150;
    
    // Force the canvas to be square
    var forceSquare = true;
    
    // The canvas context for drawing on, but not showing
    var ctx_buffer = document.createElement('canvas').getContext('2d');
    ctx_buffer.strokeStyle = "#000000";
    
    // The spinner canvas context
    var ctx_spinner = document.createElement('canvas').getContext('2d');
    ctx_spinner.canvas.height = height;
    ctx_spinner.canvas.width = width;
    
    // Create Arrow
    var arrow = new Image();
    arrow.src = "arrow.png";
    arrow.classList.add("arrow");
    
    // The options container
    var weights = {};
    
    // The number of options
    var size = 0;
    
    // The angle for the spinner to approach
    var newAngle = 0;
    
    // The current angle that the spinner is at
    var currentAngle = 0;
    
    
    /**
     * Initialize the decision spinner inside of a parent
     * 
     * param parent {element}
     */
    this.addTo = function(parent){
        //parent.style.position = "relative";
        parent.appendChild(ctx_spinner.canvas);
        parent.appendChild(arrow);
    }
    
    
    
    /**
     * Add a new option to the spinner
     *
     * param option {String}
     *
     * return {Boolean}
     */
    this.addOption = function(option){
        // if option doesn't exist
        if (!weights.propertyIsEnumerable(option)) {
            // add the new option
            weights[option] = this.createOption();
            
            //update size
            size++;
            
            // redraw
            this.updateBg();
            
            return true;
        }
        
        return false;
    }
    
    
    
    /**
     * Remove an option from the spinner
     * 
     * param option {String}
     *
     * return {Boolean}
     */
    this.removeOption = function(option){
        // if the option exists
        if (weights.propertyIsEnumerable(option)) {
            // remove the weight of the option
            size -= weights[option][0];
            
            // just to make sure, yo
            size = size<0?0:size;
            
            // actually delete it
            delete weights[option];
            
            // redraw it yo
            this.updateBg();
            
            // SUCCESS!
            return true;
        }
        // SHUCKS!!!
        return false;
    }
    
    
    
    /**
     * Fill the spinner with a new set of option
     * 
     * param options {List}
     */
    this.newOptions = function(options){
        // add the options and assign it's weight
        // update size
    }
    
    
    
    /**
     * Changes the weighting of an option
     *
     * param fromOption {String} The option to take the weight from
     * param toOption {String} The option to add the weight to
     * param weight {Double} The weight to assign to the option
     *
     * return {Number}  Weight that was reassigned
     */
    this.transferWeight = function(fromOption, toOption, weight){
        // Does each option exist?
        if (!weights.propertyIsEnumerable(fromOption)){
            console.error("Option " + fromOption + " does not exist");
            return 0;
        }
        if (!weights.propertyIsEnumerable(toOption)){
            console.error("Option " + toOption + " does not exist");
            return 0;
        }
        
        // Error catch the weight
        // make sure > 0
        weight = weight>=0?weight:0;
        // Can only transfer as much weight as it has
        weight = weight>weights[fromOption][0]?weights[fromOption][0]:weight;
        
        // change it's weight
        weights[fromOption][0] -= weight;
        weights[toOption][0] += weight;
        
        //re-draw
        this.updateBg();
        
        return weight
    }
    
    
    
    /**
     * Set the weight of an option
     *
     * param option {String}  The option to set the weight of
     * param weight {Number}  The amount of weight to set the option to
     *
     * return {Number} the weight the option was set to
     */
    this.setOptionWeight = function(option, weight){
        // If option doesn't exist
        if (!weights.propertyIsEnumerable(option)){
            console.error("Option " + option + " does not exist");
            return 0;
        }
        
        // Error catch weight
        weight = weight>=0?weight:0;
        
        // Change size by change in weight
        size += weight - weights[option][0];
        
        weights[option][0] = weight;
        
        this.updateBg();
        
        return weights[option][0];
        
    }
    
    
    
    /**
     * Draws a new background to the buffer and saves it as the canvas' background
     */
    this.updateBg = function(){
        // clear buffer
        ctx_buffer.canvas.height = height;
        ctx_buffer.canvas.width = width;
        ctx_buffer.clearRect(0, 0, width, height);
        
        // all of the slices
        var refAngle = 0;
        var i = 0;
        for (var option in weights) {
            // get the color
            ctx_buffer.fillStyle = weights[option][1];
            
            // draw the slice
            var nextAngle = refAngle + 2*Math.PI*weights[option][0]/size;
            ctx_buffer.beginPath();
            ctx_buffer.moveTo(width/2, height/2);
            ctx_buffer.arc(width/2, height/2, radius, refAngle, nextAngle);
            ctx_buffer.closePath();
            ctx_buffer.fill();
            ctx_buffer.stroke();
            
            
            // get ready for the next slice
            refAngle = nextAngle;
            i++;
        }
        
        // draw circle in case nothing is there
        /* */
        ctx_buffer.beginPath();
        ctx_buffer.arc(width/2, height/2, radius, 0, 2*Math.PI);
        ctx_buffer.closePath();
        ctx_buffer.stroke();
        /* */
        
        
        // Manual fix for graphical error where only one option has a line to the middle from the right of the circle
        // Redraw circle without graphical error
        if (1 == i) {
            ctx_buffer.fillStyle = weights[option][1];
            
            // draw the slice
            ctx_buffer.beginPath();
            ctx_buffer.arc(width/2, height/2, radius, 0, 2*Math.PI);
            ctx_buffer.closePath();
            ctx_buffer.fill();
            ctx_buffer.stroke();
        }
        // ctx_buffer.clearRect(0, 0, width, height);
        
        ctx_spinner.drawImage(ctx_buffer.canvas, 0, 0);
    }
    
    
    function randomColor() {
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += (~~(Math.random()*16)).toString(16);
        }
        return color;
    }
    
    
    /**
     * Produces a new option datastructure
     *
     * param color {String}  optional, Color of the option
     *
     * return {option}  something like [weight, color]
     */
    this.createOption = function(color){
        // eigther equals itself or a random color
        Math.random();Math.random();
        color = color||randomColor();
        
        // weights are always 1 on initialization
        return [1, color];
    }
    
    
    
    /**
     * Get option from the spinner
     *
     * return {String}  The name of the option
     */
    this.getRandOption = function(){
        // selects options with a distribution corresponding to the weights relative to the number of options
    }
    
    
    
    /**
     * Spin the spinner to a given option
     *
     * param option {String}  The name of the option to spin to
     */
    this.spinTo = function(option){
        // find the option
        // find the angle range
        // select a value within the range
    }
    
    
    
    /**
     * Main tick for the spinning animation
     */
    this.spinTick = function(){
        // initial spinning until you've gone around enough
        // slow down (linear/cosine) till you get to the determined angle (newAngle)
        //   this can be initiated at a newAngle-Pi threshold after initial spinning
    }
    
    
    
    /**
     * Handles when the mouse is clicked
     *
     * param e {MouseEvent}  The mouse event holding the data about the mouse
     */
    onMouseDown = function(e){
        dragging = true;
    }
    ctx_spinner.canvas.onmousedown = onMouseDown;
    
    
    
    /**
     * Handles when the mouse is unclicked
     *
     * param e {MouseEvent}  The mouse event holding the data about the mouse
     */
    onMouseUp = function(e){
        dragging = false;
    }
    ctx_spinner.canvas.onmouseup = onMouseUp;
    
    
    
    /**
     * Handles when the mouse is moved
     *
     * param e {MouseEvent}  The mouse event holding the data about the mouse
     */
    onMouseMove = function(e){
        if (!spinning && dragging) {
            // adjust the weights
        }
    }
    ctx_spinner.canvas.onmousemove = onMouseMove;
    
    
    
    /**
     * Returns the number of options
     *
     * return {Number}
     */
    this.getSize = function(){
        return size;
    }
    
    
    
    /**
     * Set the height of the canvas
     *
     * param height {Number}  The new height of the canvas
     */
    this.setHeight = function(h){
        height = h;
        ctx_spinner.canvas.height = height;
        
        if (forceSquare){
            width = height;
            ctx_spinner.canvas.width = width;
        }
        
        this.updateBg();
    }
    
    /**
     * Returns the height of the canvas
     * If forceSquare is set to true, then it will also set the width
     *
     * return {Number}
     */
    this.getHeight = function(){
        return height;
    }
    
    
    
    /**
     * Set the width of the canvas
     * If forceSquare is set to true, then it will also set the height
     *
     * param width {Number}  The new width of the canvas
     */
    this.setWidth = function(w){
        width = w;
        ctx_spinner.canvas.width = width;
        if (forceSquare){
            height = width;
            ctx_spinner.canvas.height = height;
        }
        
        this.updateBg();
    }
    
    /**
     * Returns the width of the canvas
     *
     * return {Number}
     */
    this.getWidth = function(){
        return width;
    }
    
    
    
    /**
     * Set the radius of the cirlce
     *
     * param r {Number}  The new radius
     */
    this.setRadius = function(r){
        // error catch r
        r = r>=0?r:0;
        radius = r;
        this.updateBg();
    }
    
    /**
     * Get the radius of the circle
     *
     * return {Number}
     */
    this.getRaidus = function(){
        return radius;
    }
    
    
    /**
     * Set whether the canvas is forced to be square or not
     *
     * param state {Boolean}
     *
     * return {Boolean}  The new state
     */
    this.setForceSquare = function(state){
        forceSquare = state;
        return forceSquare;
    }
    
    
    
    /**
     * Get whether the canvas is forced to be square or not
     *
     * return {Boolean }
     */
    this.getForceSquare = function(){
        return forceSquare;
    }
    
    
    
    /**
     * Get the weights
     *
     * return {Weights}  object where properties are the option names, and the value is [{Number} weight, {String} Color]
     */
    this.getWeights = function(){
        return weights;
    }
    
    /**
     * Get an option
     *
     * param option {String}  The name of the option
     *
     * return {Option}  Structured as such: [weight {Number}, Color {String}]
     */
    this.getOption = function(option){
        // if the option exists
        if (weights.propertyIsEnumerable(option)) {
            return weights[option];
        }
        
        // default
        return null;
    }
    
    
    
    // Final setup
    this.updateBg();
}