require("dotenv").config();
const bodyParser = require("body-parser");

let express = require("express");
let app = express();

//midleware
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  const logMessage = `${req.method} ${req.path} - ${req.ip}`;
  console.log(logMessage);
  next();
});

//route
app.get("/", (req, res) => {
  const absolutePath = __dirname + "/views/index.html";
  res.sendFile(absolutePath);
});

app.get(
  "/now",
  (req, res, next) => {
    req.time = new Date().toString();
    next();
  },
  (req, res) => res.json({ time: req.time })
);

app.get("/:word/echo", (req, res) => res.json({ echo: req.params.word }));

app
  .route("/name")
  .get((req, res) => {
    res.json({ name: `${req.query.first} ${req.query.last}` });
  })
  .post((req, res) => {
    res.json({ name: `${req.body.first} ${req.body.last}` });
  });

app.get("/json", (req, res) => {
  const messageStyle = process.env.MESSAGE_STYLE;
  const message = messageStyle === "uppercase" ? "HELLO JSON" : "Hello json";
  res.json({
    message: message,
  });
});

module.exports = app;
