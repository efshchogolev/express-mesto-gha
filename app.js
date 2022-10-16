const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const cardRouter = require("./routes/cardRoutes");
const bodyParser = require("body-parser");

const { PORT = 3333 } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use((req, res, next) => {
  req.user = {
    _id: "634c151bfd696cb4ce7aad27", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
