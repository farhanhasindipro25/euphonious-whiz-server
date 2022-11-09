const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.length("/", (req, res) => {
  res.send("Euphonious Whiz server running!");
});

app.listen(port, (req, res) => {
  console.log(`Euphonious Whiz server running on port ${port}`);
});
