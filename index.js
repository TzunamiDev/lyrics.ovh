const express = require("express");
const alltomp3 = require("alltomp3");
const request = require("request-promise");
const cors = require("cors");
var things = [];
let appApi = express();
let appServer = express();
const portApi = 8080;
const portServer = 80;

const API_KEY = process.env.API_KEY ? process.env.API_KEY : '';

appServer.use(cors());
appServer.use(express.static("frontend"));

appServer.get("/v1/:artist/:title", function (req, res) {

  if(API_KEY !== '' && (req.headers.key !== API_KEY))
    return res.status(401).send({ error: "Not authorized" })

  if (!req.params.artist || !req.params.title) {
    return res.status(400).send({ error: "Artist or title missing" });
  }
  alltomp3
    .findLyrics(req.params.title, req.params.artist)
    .then((l) => {
      res.send({ lyrics: l });
    })
    .catch((e) => {
      // console.log(e);
      res.status(404).send({ error: "No lyrics found" });
    });
});

appServer.get("/suggest/:term", function (req, res) {
  request({
    uri: "http://api.deezer.com/search?limit=15&q=" + req.params.term,
    json: true,
  }).then((results) => {
    res.send(results);
  });
});



// appApi.listen(portApi, function () {
//   console.log("API listening on port " + portApi);
// });

appServer.listen(portServer, function () {
  console.log("Frontend listening on port " + portServer);
});
