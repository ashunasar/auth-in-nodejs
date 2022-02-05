const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
require("dotenv").config();
require("./helpers/init_mongodb");
require("./helpers/init_redis");
const AuthRoute = require("./Routes/auth.route");
const { verifyAccessToken } = require("./helpers/jwt_helper");
const app = express();
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get("/", verifyAccessToken, (req, res) => {
  console.log(req.headers);
  console.log(req.headers["Authorization"]);
  res.send("Hello from express");
});
app.use("/auth", AuthRoute);
app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
