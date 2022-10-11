const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json()); // instead bodyParser from theory

// мидлваре для авторизации
// .orFail()
mongoose.connect("mongodb://localhost:27017/mydb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.get("/", (req, res) => {
  res.send(`<h1>Main Page</h1>`);
});

const { PORT = 3000 } = process.env;

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
