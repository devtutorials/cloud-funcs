'use strict';

const Buffer = require('safe-buffer').Buffer;
const escapeHtml = require('escape-html');

/* MY STUFF */
exports.actuator = (req, res) => {
  var http = require("http");

  var numRequests = 3;
  var rateLimit = "10/s";
  var options = {
    "method": "GET",
    "hostname": "35.225.71.61",
    "path": "/users?rateLimit=" + rateLimit
  };

  var responses = [];
  for (var i = 0; i < numRequests; i++) {
    var actReq = http.request(options, function (actRes) {
      var responseString = "";

      actRes.on("data", function (data) {
        responseString += data;
      });

      actRes.on("end", function () {
        responses.push(responseString);
        if (responses.length == numRequests) {
          res.send(responses.join("SEPARATOR"));
        }
      });
    });

    actReq.write("");
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
