const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const bodyParser = require("body-parser");

const { PORT = 3333 } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/mestodb");
app.use("/users", userRouter);
// app.use("/cards", cardRoutes);
// app.get("/users", (req, res) => {
//   res.send(req.query);
// });

// app.get("/users/:userId", (req, res) => {
//   res.send(req.query[req.params.userId]);
// });

// app.post("/users", (req, res) => {});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
