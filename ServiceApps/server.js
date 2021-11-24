const mongoose = require("mongoose");
const express = require("express");
const jsonServer = require("json-server");

const app = express();
mongoose.connect("mongodb://localhost:27017/testDB");

const port = 3636;

const testSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const test = new mongoose.model("Fruit", testSchema);

app.use(jsonServer.bodyParser);
app.use((req, res, next) => {
  // To allow cross domain-request from Testing Client
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");

  // For CORS resource verification.
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  console.log(req.body);
  const abc = new test(req.body);
  abc.save();
  res.send({ details: "saved" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://scs1.ups.com:${port}`);
});
