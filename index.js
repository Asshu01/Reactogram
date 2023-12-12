const express = require('express');
const path = require('path');
const PORT = 4000;
const app = express();

const cors = require('cors');
const mongoose = require('mongoose');
const {MONGODB_URL} = require('./config');

global.__basedir = __dirname;
mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected', () => {
    console.log("Connected to MongoDB");
});

mongoose.connection.on('error', (error) => {
  console.log("Some error whileConnected to MongoDB");
});

require('./models/user_model');
require('./models/postmodel');

app.use(cors());
app.use(express.json());


app.use(require('./routes/user_route'));
app.use(require('./routes/post_route'));
app.use(require('./routes/file_route'));

__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server Started");
});