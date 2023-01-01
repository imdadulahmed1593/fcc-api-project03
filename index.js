require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyparser = require("body-parser");
const isUrl = require("is-url");

// Basic Configuration
const port = process.env.PORT || 3000;
let counter = 0;
const shortenedUrls = {};

app.use(cors());

app.use(bodyparser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  const url = req.body.url;
  // check if url is valid
  if (!isUrl(url)) {
    res.json({ error: "invalid url" });
    return;
  }

  counter += 1;
  shortenedUrls[counter] = url;
  res.json({ original_url: req.body.url, short_url: counter });
});

app.get("/api/shorturl/:id", function (req, res) {
  const id = req.params.id;
  const url = shortenedUrls[id];
  res.redirect(url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
