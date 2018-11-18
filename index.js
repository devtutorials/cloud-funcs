'use strict';

// const Buffer = require('safe-buffer').Buffer;
// const escapeHtml = require('escape-html');

/* MY STUFF */
exports.actuator = (req, res) => {

  var http = require("http");

  var numReqs = 10;
  var rateLimit = "1/s";
  // var hostname = ;

  var options = {
    "method": "GET",
    "hostname": "35.225.71.61",
    "path": "/users?rateLimit=" + rateLimit
  };
  var actReq;
  var responses = new Array();
  for (var i = 0; i < numReqs; i++) {
    actReq = http.request(options, function (actRes) {
      var responseString = "";

      actRes.on("data", function (data) {
        responseString += data;
      });

      actRes.on("end", function () {
        responses.push(responseString);
        if (responses.length == numReqs) {
          res.send(responses.join("\n\n") + "LENGTH: " + responses.length.toString());
        }
      });
    });
    actReq.write("");
    actReq.end();
  }

  // res.send("done");
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
