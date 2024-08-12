const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {          // "/" called as child route    //if user logged in then only he can add reviews(backend)
    //console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);    //extract id from show.ejs when form submitted
    let newReview = new Review(req.body.review);            //insert one review //extract reviews(rating, comments) from show.ejs when form submitted and store in newReview
    newReview.author = req.user._id;                        //curr user/loggedIn user become author
    //console.log(newReview);
    listing.reviews.push(newReview);                        //push newReview in listing.js

    await newReview.save();                                 //save in reviews collection
    await listing.save();                                   //save in listings collection
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);               //redirect on show page
    // console.log("new review saved");
    // res.send("new review saved");            
};

module.exports.destroyReview = async (req, res) => { // /:reviewId called as child route
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});  //$pull is a mongoose operator //reviews array(under listingSchema) ke under jis bhi review se hamari reviewId match kare use pull(remove) kar do
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
  };