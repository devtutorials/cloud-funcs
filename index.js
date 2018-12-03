'use strict';

exports.actuator3 = (req, res) => {
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
  let start = Date.now();
  var responses = [];
  console.log("###################################");
  for (var i = 0; i < numReqs; i++) {
    setTimeout(function() {http.request(options, function (actRes) {
      var responseString = "";

      actRes.on("data", function (data) {
        responseString += `${Date.now() - start} ms`;
      });

      actRes.on("end", function () {
        console.log("ended request");
        responses.push(responseString);
        if (responses.length == numReqs) {
          var end = Date.now();
          var displayVal = "";
          for (var j = 0; j < responses.length; j++) {
            displayVal += `${j+1}. ${responses[j]} <br>`;
          }
          displayVal += `Total time: ${end - start} ms`;
          res.send(displayVal);
        }
      });
    }).end();}, i * interval);

  }
}
