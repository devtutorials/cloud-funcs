'use strict';

const Buffer = require('safe-buffer').Buffer;
const escapeHtml = require('escape-html');

/* MY STUFF */
exports.reqactuator = (req, res) => {
  var http = require("http");

  var rateLimit = "1/s";
  var options = {
    "method": "GET",
    "hostname": "35.225.71.61",
    "path": "/users?rateLimit=" + rateLimit
  };

  var actReq = http.request(options, function (actRes) {
    var responseString = "";

    actRes.on("data", function (data) {
      responseString += data;
    });

    actRes.on("end", function () {
      res.send(responseString);
    });
  });

  actReq.write("");
  actReq.end();
}
