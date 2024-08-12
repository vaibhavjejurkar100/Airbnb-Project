const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let {username, email, password} = req.body;                      //extract from req body(when button was submit in signup.ejs)
        const newUser = new User({email, username});                     //insert single user
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {                             //passport.authenticate middleware invokes automatically req.login when user singup, req.login invoke automatically and login for user automatically (after signup, no need of login, user automatically login after signup)
            if(err) {
                return next(err);
            }
            req.flash("success", "welcome to Wanderlust");
            res.redirect("/listings");
        })
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
        }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {                                        //if authentication successful(user already singup or exist in db) by passport.authenticate then only async callback execute
    req.flash("success", "Welcome back to Wanderlust!");     //success msg show on /listing page
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {                                        //req.logout is a passport's inbuild method for logout
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};