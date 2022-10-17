const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const cardRouter = require("./routes/cardRoutes");
const bodyParser = require("body-parser");

const { PORT = 3333, MONGO_URL = "mongodb://localhost:27017/mestodb" } =
  process.env;

const app = express();
app.use(bodyParser.json());

mongoose.connect(MONGO_URL);

app.use((req, res, next) => {
  req.user = {
    _id: "634c151bfd696cb4ce7aad2", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
