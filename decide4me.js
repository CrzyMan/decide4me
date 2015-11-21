/**
 * Contructor for a new Spinner and its handler
 */
var Decide4Me = function(){
    
    // Variables are private to the class, so getters/setters are necesarry
    
    // Code version (public date)
    this.version = "15.11.21";
    
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
    this.arrow = arrow;
    arrow.src = "arrow.png";
    arrow.classList.add("arrow");
    
    // The options container
    var weights = {};
    
    // The number of options
    var size = 0;
    
    // The angle for the spinner to approach
    var newAngle = 0;
    
    // Maximum change in angle per tick
    var dAngleMax = 0.2;
    
    // The current angle that the spinner is at
    var currentAngle = 0;
    
    // Minimum difference in angle before we just say it is at the same angle
    var angleProximityThreshold = 0.001;
    
    
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
        
        // draw circle in case nothing is there
        /* */
        ctx_buffer.fillStyle = "white";
        ctx_buffer.beginPath();
        ctx_buffer.arc(width/2, height/2, radius, 0, 2*Math.PI);
        ctx_buffer.closePath();
        ctx_buffer.stroke();
        ctx_buffer.fill();
        /* */
        
        var refAngle = 0;
        var i = 0;
        // If there is anything to draw
        // Draw all of the slices
        for (var option in weights) {
            if (weights[option][0] > 0){
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
        }
        
        
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
        
        ctx_spinner.clearRect(0, 0, width, height);
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
     * Get option from the spinner with a random distribution that corresponds to the weighting
     *
     * return {String}  The name of the option
     */
    this.getRandomOption = function(){
        if (size < 0) {
            return undefined;
        }
        
        // select a weight within the range
        var w = Math.random()*size;
        
        // The selected option
        var selected = "";
        
        var sumWeight = 0;
        // Look through the options
        for (var o in weights) {
            if (weights[o][0] > 0){
                sumWeight += weights[o][0];
                
                // Check if the weight is within this option
                if (sumWeight > w) {
                    return o;
                }
            }
        }
        
        // If you get here, it's super weird and w > size I think
        return undefined;
    }
    
    
    
    /**
     * Spin the spinner to a given option
     *
     * param option {String}  The name of the option to spin to
     */
    this.spinToOption = function(option){
        // Don't do anything if already spinning
        if (spinning || weights[option][0] <= 0) {
            return;
        }
        
        // Find the weight range
        var start = 0;
        var end = 0;
        
        for (var o in weights) {
            // If not the right option
            if (option != o) {
                // Keep shifting
                start += weights[o][0];
            } else {
                // If the option, then set the end
                end  = start + weights[o][0];
                break;
            }
        }
        
        // Constant to convert weight to angle
        var convToAngle = 2*Math.PI/size;
        
        // Select a value within the range
        var angle = (start + Math.random()*(end-start))*convToAngle;
        
        // Spin to it yo
        this.spinToAngle(angle);
    }
    
    
    /**
     * Spin the spinner to a certain angle
     *
     * param angle {Number}  The angle to spin to
     */
    this.spinToAngle = function(angle) {
        // make sure that the angle is greater than the current angle by a couple of spins
        if (angle < currentAngle + Math.PI) {
            angle += 2*Math.PI*(1 + ~~(Math.random()*2));
        }
        
        nextAngle = angle;
        
        // Start the spin
        spinning = true;
        window.requestAnimationFrame(this.spinTick.bind(this));
    }
    
    
    /**
     * Main tick for the spinning animation
     */
    this.spinTick = function(){
        // Initial spinning until you've gone around enough
        if (currentAngle < nextAngle - Math.PI){
            currentAngle += dAngleMax;
        } else {
            if (currentAngle < nextAngle - angleProximityThreshold) {
                // Slow down (linear/sinusoidal) till you get to the determined angle (newAngle)
                // Sinusoidal
                var scaleFactor = Math.sin(0.5*(nextAngle-currentAngle));
                
                currentAngle += dAngleMax*scaleFactor;
                
            } else {
                // Reset current angle with modulus
                currentAngle = nextAngle%(2*Math.PI);
                
                // You've stopped spinning
                spinning = false;
                
                // Call the callback
                this.onReachAngle();
            }
        }
        
        // Change the angle of the arrow
        this.setArrowAngle(currentAngle);
        
        // Keep spinning if you have to
        if (spinning) {
            window.requestAnimationFrame(this.spinTick.bind(this));
        }
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
    
    
    
    /**
     * Properly sets the arrow's angle
     *
     * param angle {Number}  The new angle of the arrow
     */
    this.setArrowAngle = function(angle){
        arrow.style.transform = "translate(-50%, -50%) rotate("+angle+"rad)";
    }
    
    
    
    /**
     * To be called once the angle has been reached after a spin
     */
    this.onReachAngle = function(){
        // stuff
        console.log("Angle was reached")
    }
    
    /**
     * returns whether the spinner is spinning or not
     */
    this.isSpinning = function(){
        return spinning;
    }
    
    
    // Final setup
    this.updateBg();
}