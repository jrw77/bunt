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
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

 
        //hide loading bar
        document.getElementsByClassName('app')[0].setAttribute('style', 'display:none;');

        //display my stuff
        //document.getElementsByClassName('picture')[0].setAttribute('style', 'display:block;');

        //Picture stuff
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 25,
            encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.FILE_URI,
            targetWidth: window.innerWidth,
            targetHeight: window.innerHeight
        });

        function onSuccess(imageData) {
            //show image in picture div
            var image = document.getElementById('yes');
            image.src = imageData;
    

            //stuff
            // set up some sample squares
            var example = document.getElementById('example');
            var context = example.getContext('2d');
            example.height = window.innerHeight - 100;
            example.width = window.innerWidth;

            //other div
            var statusDiv = document.getElementById('status');
            statusDiv.height = 150;
            statusDiv.width = 300;

            var otherContext = statusDiv.getContext('2d');

            //wait until picture is loaded
            image.onload = function () {
                context.drawImage(image, 0, 0);

                otherContext.fillStyle = "rgb(255,0,0)";
                otherContext.fillRect(0, 0, 50, 50);
                otherContext.fillStyle = "rgb(0,0,255)";
                otherContext.fillRect(55, 0, 50, 50);
            }


            //hexcode variable
            var hex = "#000000";

            //touch stuff
            example.onclick = (function (e) {
               
                var pos = findPos(this);
                var x = e.pageX - pos.x;
                var y = e.pageY - pos.y;
                var c = this.getContext('2d');
                var p = c.getImageData(x, y, 1, 1).data;
                hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
                alert(x + " " + y + " " + hex);

                //should draw the boxes


                otherContext.fillStyle = hex;
                otherContext.fillRect(0, 0, 50, 50);
                otherContext.fillStyle = hex;
                otherContext.fillRect(55, 0, 50, 50);                

            });




        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
        function findPos(obj) {
            var curleft = 0, curtop = 0;
            if (obj.offsetParent) {
                do {
                    curleft += obj.offsetLeft;
                    curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
                return { x: curleft, y: curtop };
            }
            return undefined;
        }

        function rgbToHex(r, g, b) {
            if (r > 255 || g > 255 || b > 255)
                throw "Invalid color component";
            return ((r << 16) | (g << 8) | b).toString(16);
        }






        
        console.log('Received Event: ' + id);
    }
};
