const express = require("express");
const router = express.Router();
const passport = require("passport"); // Make sure you have this line
const User = require("../models/user");

router.get("/signup", (req, res) => {
	res.render("users/signup.ejs");
});

module.exports = router;
