const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL);
const userSchemas = new mongoose.Schema({
  username: {
    type: String,
  },
});

const User = mongoose.model("User", userSchemas);
app.post("/api/users", async (req, res) => {
  const { username } = req.body;
  if (!username) res.status(400).json({ error: "username field required" });
  const user = await User.insertOne({
    username,
  });
  res.json({ _id: user._id, username });
});

app.get("/api/users", async (req, res) => {
  const users = await User.find().select({
    __v: 0,
  });
  res.json(users);
});

const responseExercise = {
  username: "",
  description: "",
  duration: "",
  date: "",
  _id: "",
};
const exerciseSchemas = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  description: {
    type: String,
  },
  duration: {
    type: Number,
  },
  date: {
    type: Date,
  },
});
const Exercise = mongoose.model("Exercise", exerciseSchemas);
app.post("/api/users/:_id/exercises", async (req, res) => {
  let { description, duration, date } = req.body;
  const userId = req.params._id;
  if (!description || !duration)
    return res.status(400).json({ error: "some field required" });
  duration = parseInt(duration);
  date = date ? new Date(date) : Date.now();
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "user id not found" });
  const exercise = await Exercise.insertOne({
    user: user._id,
    description,
    duration,
    date,
  });
  const data = responseExercise;
  (data._id = user._id), (data.username = user.username);
  data.description = exercise.description;
  data.duration = exercise.duration;
  data.date = new Date(exercise.date).toDateString();
  res.json(data);
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const user = await User.findById(req.params._id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { from, to, limit } = req.query;
  const query = {
    user: user._id,
  };
  if (from | to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }
  let exercises = Exercise.find(query).sort({ date: 1 });
  if (limit) exercises.limit(parseInt(limit));
  exercises = await exercises.exec();

  const data = {
    _id: user._id,
    username: user.username,
    count: exercises.length,
    log: exercises.map((record) => ({
      description: record.description,
      duration: record.duration,
      date: new Date(record.date.toISOString().split("Z")[0]).toDateString(),
    })),
  };
  console.log(data);

  res.json(data);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
