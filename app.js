var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mysql = require("mysql");
require("dotenv").config();

var connection = mysql.createConnection({
  host: process.env.DB_HOST,

  port: process.env.DB_PORT,

  user: process.env.DB_USER,

  password: process.env.DB_PASS,

  database: process.env.DB_NAME,
});

connection.connect(function (err) {
  if (err) {
    console.error("mysql connection error");

    console.error(err);

    throw err;
  } else {
    console.log("mysql connection success");
  }
});

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
app.use(express.json());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

connection.query("SELECT * FROM basic", function (error, results, fields) {
  if (error) {
    console.log(error);
  }
  var data = JSON.parse(JSON.stringify(results));
  console.log(data);
});

connection.end();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
