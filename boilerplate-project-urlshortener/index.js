require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);

const urlSchema = new mongoose.Schema({
  link: {
    type: String,
  },
});

const Url = mongoose.model("Url", urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const dns = require("dns");

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

async function createUrl(link) {
  const url = new Url({
    link,
  });
  await url.save();
  return url;
}

async function findUrlById(id) {
  const url = await Url.findById(id);
  return url;
}

app.post("/api/shorturl", async (req, res) => {
  const url = req.body.url;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    dns.lookup(hostname, (err) => {
      if (err) return res.json({ error: "invalid url" });
    });
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return res.json({ error: "invalid url" });
    }
  } catch (error) {
    return res.json({ error: "invalid url" });
  }

  const createdUrl = await createUrl(url);
  res.json({ original_url: url, short_url: createdUrl._id });
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  const shortUrlId = req.params.short_url;
  const urlById = await findUrlById(shortUrlId);

  if (!urlById) return res.json({ error: "invalid id url" });

  res.redirect(urlById.link);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
