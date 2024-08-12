const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./Schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    //console.log(req.user);                        //passport will store current user info in req obj, when user in the session
    if(!req.isAuthenticated()) {                    //req.isAuthenticated() is a passport's inbuild method which checks User is already authenticate(login or not) or not
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
      next();
};

module.exports.saveRedirectUrl = (req, res, next) => {        //saveredirectUrl is a middleware , redirect on (e.g) edit page -> login page  -> edit page
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {              //check owner of listing before edit, update or delete the page(only owner can edit, update, delete the listing)
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {              //check listing owner with current user
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = async (req, res, next) => { 
    let { error } = listingSchema.validate(req.body);                  // under listingSchema's created constaits(validators) are satisfy(applied) on req body or not)
     if(error) {                                                       //if error occur
        let errMsg = error.details.map((el) => el.message).join(",");  //find errors in details and map them in individual error, and return an individual error msg and seperated by comma
       throw new ExpressError(400, errMsg);                            //then throw err 
    } else {
        next();                                                        //next() method throw err to non handling middleware(in create and update route, where validateListing passed as a middleware)
    }
 };

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); 
    if(error) {                                      
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);           
    } else {
        next();                                       
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {              //check author of review before  delete the page(only owner can delete the review)
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {                  //check  review author with current user
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
