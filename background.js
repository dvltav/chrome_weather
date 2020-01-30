// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var min = 1;
var max = 5;
var current = min;

function updateIcon(temp) {
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
    var url = "http://192.168.1.35:8080/api/weather_now";
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.onload = function(e) {
    if (this.status == 200) {
      console.log('weather =' + this.responseText);
      var obj = JSON.parse(this.responseText);
      let temp = obj[0].outTemp;
      let tempYesterday = Math.round(temp - obj[0].outTempYesterday);
      //r = Math.round( tempYesterday * 10 ) / 10 ;
      s = Math.round(temp)  + "/" + tempYesterday;
      chrome.browserAction.setBadgeText({text: s});  
      if (tempYesterday > 0) {
        chrome.browserAction.setBadgeBackgroundColor({color: "#cc2900"}); //   ""
      } else {
        chrome.browserAction.setBadgeBackgroundColor({color: "#0073e6"}); 
      }
      chrome.browserAction.setTitle({title: s});

      updateIcon(temp);
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

