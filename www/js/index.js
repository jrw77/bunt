// this is our app
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log("received event " + id);

        //bind the 'take again' button
        document.getElementById('takeAgain').onclick = app.takePicture;

        //take the picture
        app.takePicture();
    },

    takePicture: function(){
        //Picture stuff
        navigator.camera.getPicture(app.pictureTaken, app.pictureFailedToTake, {
            quality: 25,
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.FILE_URI,
            targetWidth: 300,
            targetHeight: 300
        });
        //show the take again button
        document.getElementById('takeAgain').setAttribute('style', 'display:inline;');
    },

    pictureTaken: function(imageData){
        //show image in picture div
        var image = document.getElementById('yes');
        image.style.display = "block";
        image.src = imageData;

        // set up
        var example = document.getElementById('example');
        var context = example.getContext('2d');
        example.height = 300;
        example.width = 300;

        //other div
        var statusDiv = document.getElementById('status');
        statusDiv.height = 50;
        statusDiv.width = 300;

        var otherContext = statusDiv.getContext('2d');

        //wait until picture is loaded
        image.onload = function () {
            console.log("image loaded. w="+image.width+ "h="+image.height);
            example.width = image.width;
            example.height = image.height;
            context.drawImage(image, 0, 0, image.width, image.height);
            image.style.display = "none";

            console.log("image set"+example.style.display);
            //box 1
            otherContext.fillStyle = "rgb(255,0,0)";
            otherContext.fillRect(0, 0, 50, 50);

            //box 2
            otherContext.fillStyle = "rgb(0,0,255)";
            otherContext.fillRect(55, 0, 50, 50);

            //box 3
            otherContext.fillStyle = "rgb(0,0,255)";
            otherContext.fillRect(110, 0, 50, 50);
            console.log("box set")
        }


        //hexcode variable
        var hex = "#000000";

        //touch stuff
        example.onclick = app.pictureClicked;
    },
    pictureFailedToTake: function(message){
        alert('Failed because: ' + message);
    },
    pictureClicked: function(e){
        console.log("canvas clicked");
        var otherContext = document.getElementById('status').getContext('2d');

        var pos = app.canvasFindPos(this);
        var x = e.pageX - pos.x;
        var y = e.pageY - pos.y;
        var c = this.getContext('2d');
        var p = c.getImageData(x, y, 1, 1).data;
        var q = c.getImageData(x - 5, y + 5, 1, 1).data;
        var r = c.getImageData(x + 5, y - 5, 1, 1).data;
        hex = ("000000" + app.rgbToHex(p[0], p[1], p[2])).slice(-6);
        var hexQ = ("000000" + app.rgbToHex(q[0], q[1], q[2])).slice(-6);
        var hexR = ("000000" + app.rgbToHex(r[0], r[1], r[2])).slice(-6);

        //should draw the boxes
        otherContext.fillStyle = "#" + hex;
        otherContext.fillRect(0, 0, 50, 50);

        otherContext.fillStyle = "#" + hexQ;
        otherContext.fillRect(55, 0, 50, 50);

        otherContext.fillStyle = "#" + hexR;
        otherContext.fillRect(110, 0, 50, 50);
    },
    canvasFindPos: function(obj){
        var curleft = 0, curtop = 0;
        if (obj.offsetParent) {
            //do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            //} while (obj = obj.offsetParent);
            return { x: curleft, y: curtop };
        }
        return undefined;
    },
    rgbToHex: function(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }
};