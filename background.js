// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


var min = 1;
var max = 5;
var current = min;
var windMax = 10;
var disableNotifications = false;

function onClickNotification(){
  var newURL = "http://cs1.pixelcaster.com/yosemite/yosfalls.jpg";
  chrome.windows.create({ url: newURL, type: "popup" });

}

chrome.idle.setDetectionInterval(60*5);

function onStateActive(newState){
  (( newState == 'active') && yosemiteNotification());
  console.log(newState);
}

function updateIcon(temp) {
  //chrome.browserAction.setIcon({path:"icon" + current + ".png"});
  /**
  current++;
  if (current > max)
    current = min;
	console.log('COLOR ' + Date.now());
	**/  
}

function restore_options() {
    console.log("restore_options");
    chrome.storage.sync.get({
    windGust: windMax,
    disable: false
  }, function(items) {
    windMax = items.windGust;
    disableNotifications = items.disable;
  });
}

function onWatchdog() {
    getWeather();
    //alert("Time's up!");
}

function getWeather() {
  var url = "http://192.168.1.35:8080/api/weather_now";
	var xhr = new XMLHttpRequest();
	
  xhr.open('GET', url, true);
	
  xhr.onload = function(e) {
    if (this.status == 200) {
      console.log('weather =' + this.responseText);
      var obj = JSON.parse(this.responseText);
      var temp = obj[0].outTemp;
      var tempYesterday = temp - obj[0].outTempYesterday;
      var wind = obj[0].windGust;

      s = temp.toFixed(1) + "c " + tempYesterday.toFixed(1) + "c " + wind + " mph " + obj[0].rain + " in";
      chrome.browserAction.setTitle({title: s});

     //updateIcon(temp);
      //setBadgeTextAndColor(temp,tempYesterday);
      drawCanvasIcon(temp, tempYesterday);
      windNotification(wind);
    } else {
		  console.log("error getting weather data");
	   }
  }; //onload

  xhr.send(null);
//  
} //getWeather

function windNotification(wind) {
  //wind = windMax + 1;   //TESTING
  if (wind > windMax) 
      chrome.notifications.create( {
        type: 'basic',
         iconUrl: 'icon1.png',
        title: 'High wind ' + wind + ' mph ',
        message: 'Wind is ' + wind + ' mph '
     });
}

//Not used currently
function setBadgeTextAndColor(temp, tempYesterday){
      s = Math.round(temp)  + "/" + Math.round(tempYesterday);
      //s = String(temp.toFixed(0));

      chrome.browserAction.setBadgeText({text: s});  
      chrome.browserAction.setBadgeBackgroundColor({color: iconColor(tempYesterday)});      
}

function iconColor(tempYesterday){

  redTemp = ["#cc2900","#a82606","#852309","#852309","#852309","#852309"];
  blueTemp = ["#0073de","#185fb5","#1e4c8e","#1e4c8e","#1e4c8e","#1e4c8e"];

  var color;
        if (tempYesterday > 0.7) {
        color =  redTemp[tempYesterday.toFixed(0)-1]; 
      } else if (tempYesterday < -0.7) {
        color =  blueTemp[Math.abs(tempYesterday.toFixed(0))-1];
      } else {
        
        color = "#008000";
      }

  return color;
}

function drawCanvasIcon(temp, tempYesterday) {
  var canvas = document.createElement('canvas'); // Create the canvas
  canvas.width = 26;
  canvas.height = 26;

  var context = canvas.getContext('2d');


  color = iconColor(tempYesterday);

  context.fillStyle = color; //"#262626";
  context.fillRect(0, 0, 26, 26);

  context.fillStyle = "#FFFFFF";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "15px Arial";
  context.fillText(String(temp.toFixed(0)), 9, 11);

  chrome.browserAction.setIcon({
    imageData: context.getImageData(0, 0, 19, 19)
  });
}

function yosemiteNotification(){
      //https://cs1.pixelcaster.com/yosemite/yosfalls.jpg
      url = 'https://pixelcaster.com/yosemite/webcams/ahwahnee2.jpg'
    
      
      chrome.notifications.create( {
        type: 'image',
         iconUrl: url,
         imageUrl: url,
        title: 'Yosfalls',
        message: 'Yosfalls'
     });
}

chrome.browserAction.onClicked.addListener(updateIcon);
chrome.alarms.onAlarm.addListener(onWatchdog);
chrome.alarms.create('watchdog', {periodInMinutes:1});
chrome.notifications.onClicked.addListener(onClickNotification);
chrome.idle.onStateChanged.addListener(onStateActive);
restore_options();
getWeather();
chrome.storage.onChanged.addListener(function(changes, namespace) {restore_options();});


