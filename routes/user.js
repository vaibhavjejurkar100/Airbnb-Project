const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

//code becomes compact now after add in single route(routing.route)
router.route("/signup")                           //adding common paths in single route(routing.route)
.get(userController.renderSignupForm)
.post(wrapAsync (userController.signup));

router.route("/login")                           //adding common paths in single route(routing.route)
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", {                             //passport.authenticate is a middleware, which authenticate(verify) is user already singup or not(exist in database or not)  //local passed as a strategy
        failureRedirect: "/login",                               //if user's authentication failed(user not already singup(wrong username or password)) by passport.authenticate then it redirect on same page i.e /login
        failureFlash: true,                                      //failure msg will show after authentication failed
    }),
    userController.login
);

//get route(signup)
// router.get("/signup", userController.renderSignupForm);

// //post route(signup)
// router.post("/signup", wrapAsync (userController.signup));

//get route(login)
//router.get("/login", userController.renderLoginForm);

//post route(login)
// router.post(
//     "/login",
//     saveRedirectUrl,
//     passport.authenticate("local", {                             //passport.authenticate is a middleware, which authenticate(verify) is user already singup or not(exist in database or not)  //local passed as a strategy
//         failureRedirect: "/login",                               //if user's authentication failed(user not already singup(wrong username or password)) by passport.authenticate then it redirect on same page i.e /login
//         failureFlash: true,                                      //failure msg will show after authentication failed
//     }),
//     userController.login
// );

//logout
router.get("/logout", userController.logout);

module.exports = router;

