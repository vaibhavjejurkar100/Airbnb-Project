//Express Router - //Restructuring Reviews //shifting all reviews routes here from app.js
const express = require("express");
const router = express.Router({mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const {  reviewSchema } = require("../Schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body); 
//     if(error) {                                      
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);           
//     } else {
//         next();                                       
//     }
// };

//Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync (reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync (reviewController.destroyReview));

module.exports = router;