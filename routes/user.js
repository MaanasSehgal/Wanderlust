const express = require("express");
const router = express.Router();
const passport = require("passport"); // Make sure you have this line
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const {saveRedirectUrl} = require("../middleware");

const userController = require("../controllers/users");

//signup get route
router.get("/signup", userController.renderSignupForm);

//signup
router.post("/signup", wrapAsync(userController.signup));

//login
router.get("/login", userController.renderLoginForm);

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    wrapAsync(userController.login)
);

router.get("/logout", userController.logout);

module.exports = router;
