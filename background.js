// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var min = 1;
var max = 5;
var current = min;

function updateIcon() {
  chrome.browserAction.setIcon({path:"icon" + current + ".png"});
  current++;
  if (current > max)
    current = min;
	console.log('COLOR ' + Date.now());
}

function timeStamp() {
    var currentdate = new Date(); 
    var datetime =  currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/" 
        + currentdate.getFullYear() + " @ "  
        + currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();
    console.log('ALARRRRRRRRRRRRRRMMMM' + datetime);

}


function onWatchdog() {
    timeStamp();
    getWeather();
    //alert("Time's up!");
}

function getWeather() {
    var url = "http://vltavsky.com:500/outTempOne.php";
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.onload = function(e) {
    if (this.status == 200) {
      console.log('weather =' + this.responseText);
	  chrome.browserAction.setBadgeText({text: this.responseText});
    } 
	else 
	{
		console.log("error getting weather data");
	}
	
  };

  xhr.send(null);
//
  
}



timeStamp();
chrome.browserAction.onClicked.addListener(updateIcon);
chrome.alarms.onAlarm.addListener(onWatchdog);
chrome.alarms.create('watchdog', {periodInMinutes:5});
getWeather();
updateIcon();
