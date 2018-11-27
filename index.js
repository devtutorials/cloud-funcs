'use strict';

const Buffer = require('safe-buffer').Buffer;
const escapeHtml = require('escape-html');

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

}
