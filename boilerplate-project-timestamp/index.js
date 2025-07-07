// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// convert to unix and utc
app.get("/api/:time?", (req, res) => {
  const inputDate = req.params.time || Date.now();
  const unix = parseInt(inputDate);

  const date = new Date(inputDate);
  const validatedDate = date == "Invalid Date" ? new Date(unix) : date;

  if (validatedDate == "Invalid Date")
    return res.json({ error: "Invalid Date" });

  res.json({ unix: validatedDate.getTime(), utc: validatedDate.toUTCString() });
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
