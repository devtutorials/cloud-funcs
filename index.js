'use strict';

// const Buffer = require('safe-buffer').Buffer;
// const escapeHtml = require('escape-html');

/* MY STUFF */
exports.actuator = (req, res) => {

  var http = require("http");

  var numRequests = 20;
  var rateLimit = "10/s";
  var options = {
    "method": "GET",
    "hostname": "35.225.71.61",
    "path": "/users?rateLimit=" + rateLimit
  };

  var responses = [];
  var start = Date.now();
  for (var i = 0; i < numRequests; i++) {
    var actReq = http.request(options, function (actRes) {
      var responseString = "";

      actRes.on("data", function (data) {
        responseString += data;
      });

      actRes.on("end", function () {
        responses.push(responseString);
        if (responses.length == numRequests) {
          var end = Date.now();
          var displayVal = "";
          for (var j = 0; j < responses.length; j++) {
            displayVal += `${j+1}. ${responses[j]} <br>`;
          }
          displayVal += `Total time: ${end - start} ms`;
          res.send(displayVal);
        }
      });
    });

    actReq.end();
  }
}

exports.actuator2 = (req, res) => {
  var http = require("http");

  let rateLimit = req.query.rateLimit;
  let interval = req.query.interval;
  let numReqs = req.query.numReqs;

  if (!rateLimit || !interval || !numReqs) {
    res.status(400).send("bad request");
  }

  var options = {
    "method": "GET",
    "hostname": "35.225.71.61",
    "path": "/users?rateLimit=" + rateLimit
  };

  var intervalStart = Date.now();
  var intervalEnd = Date.now();
  for (var i = 0; i < numReqs; i++) {
    while (intervalEnd - intervalStart < interval) {
      intervalEnd = Date.now();
    }

    var actReq = http.request(options, function (actRes) {
      // Do nothing
    });

    actReq.end(); // send request

    intervalStart = intervalEnd;
  }
  res.send("Done");
}

exports.test = (req, res) => {
  res.send(
    JSON.stringify(req, function(key, value) {
      if (["owner", "socket", "outgoing", "_httpMessage", "parser", "req"].includes(key)) {
        return null;
      } else {
        return value;
      }
    })
  );
}

exports.test2 = (req, res) => {
  res.send(req.param['someprop']);
}
