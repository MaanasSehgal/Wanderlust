const express = require("express");
const router = express.Router();
const passport = require("passport"); // Make sure you have this line
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
	res.render("users/signup.ejs");
});

router.post(
	"/signup",
	wrapAsync(async (req, res) => {
		try {
			let { username, email, password } = req.body;
			const newUser = new User({ email, username });
			const registeredUser = await User.register(newUser, password);
			// console.log(registeredUser);
			req.login(registeredUser, (err) => {
				if (err) {
					return next(err);
				}
				req.flash("success", "Welcome to Wanderlust!");
				res.redirect("/listings");
			});
		} catch (err) {
			req.flash("error", err.message);
			res.redirect("/signup");
		}
	}),
);

router.get("/login", (req, res) => {
	res.render("users/login.ejs");
});

router.post(
	"/login",
	saveRedirectUrl,
	passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
	wrapAsync(async (req, res) => {
		req.flash("success", "Welcome to Wanderlust! You are logged in!");
		//to redirect user to last page they were on
		let redirectUrl = res.locals.redirectUrl || "/listings";
		res.redirect(redirectUrl);
	}),
);

router.get("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		req.flash("success", "You are logged out!");
		res.redirect("/listings");
	});
});

module.exports = router;
