/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
        //app.takePicture();
    },

    takePicture: function(){
        //Picture stuff
        navigator.camera.getPicture(app.pictureTaken, app.pictureFailedToTake, {
            quality: 50,
            allowEdit : true,
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
        //wait until picture is loaded
        image.onload = function () {
            console.log("image loaded. w="+image.width+ "h="+image.height);
            example.width = image.width;
            example.height = image.height;
            context.drawImage(image, 0, 0, image.width, image.height);
            image.style.display = "none";

            console.log("image set"+example.style.display);
        }


        //hexcode variable
        var hex = "#000000";

        //touch stuff
        example.onclick = app.pictureClicked;
    },
    pictureFailedToTake: function(message){
        //alert('Failed because: ' + message);
    },
    pictureClicked: function(e){
        console.log("canvas clicked");

        var pos = app.canvasFindPos(this);
        var x = pos.x, y = pos.y;
        var c = this.getContext('2d');
        var p = c.getImageData(x, y, 1, 1).data;
        var q = c.getImageData(x - 5, y + 5, 1, 1).data;
        var r = c.getImageData(x + 5, y - 5, 1, 1).data;
        hex = ("000000" + app.rgbToHex(p[0], p[1], p[2])).slice(-6);
        var hexQ = ("000000" + app.rgbToHex(q[0], q[1], q[2])).slice(-6);
        var hexR = ("000000" + app.rgbToHex(r[0], r[1], r[2])).slice(-6);
        var square1 = document.getElementById('square1');
        var square2 = document.getElementById('square2');
        var square3 = document.getElementById('square3');

        //should draw the boxes
        square1.style.backgroundColor="#" + hex;
        square2.style.backgroundColor="#" + hexR;
        square3.style.backgroundColor="#" + hexQ;

        console.log("at bottom of click" + hex);
    },
    canvasFindPos: function(obj){
      var rect = obj.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      console.log("x: " + x + " y: " + y);
        /*var curleft = 0, curtop = 0;
        if (obj.offsetParent) {
            //do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            //} while (obj = obj.offsetParent);
            return { x: curleft, y: curtop };
        }
        return undefined;*/
        return { 'x': x, 'y': y };
    },
	//("000000" + app.rgbToHex(gotColor[0], gotColor[1], gotColor[2])).slice(-6)

	whatColor: function(param){
		var squareInQuestion = document.getElementById(param);
		var gotColor = (squareInQuestion.style.backgroundColor);
		var result = document.getElementById('result');
		var colString = gotColor.substring(4,gotColor.length-1).replace(' ','').split(',');

		//var texty = "<p>"+gotColor+"\n#"+app.rgbToHex(gotColor.data[0], gotColor.data[1], gotColor.data[2])+"</p>"
		var texty = "<p>"+gotColor+"<br />#"
            +app.rgbToHex(colString[0], colString[1], colString[2])+"</p>";

		result.innerHTML = texty;
		//alert(""+texty);
		///alert(colString[0]);
		result.style.visibility="visible";
	},
    rgbToHex: function(r, g, b) {
        if (r > 255 || g > 255 || b > 255 || r < 0 || g < 0 || b < 0)
            throw "Invalid color component";
        var temp = ((r << 16) | (g << 8) | b).toString(16);
        // make sure always 6 digits are returned.
        return ("000000"+temp).slice(-6)
    }
};
