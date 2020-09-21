var express = require("express");
var router = express.Router();
var pool = require("../db");

/* GET home page. */
router.get("/", async (req, res, next) => {
  let data;

  try {
    data = await pool.query("SELECT * FROM basic");

    data = JSON.parse(JSON.stringify(data[0][0]));
  } catch (err) {
    console.log(err);
  }

  res.render("index", { title: "Express", text: data.text });
});

module.exports = router;
