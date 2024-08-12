//Express Router - //Restructuring Listings //shifting all listings routes here from app.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema } = require("../Schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");       //multer is a middleware, which parse(handle) multipart/form data for sending files(images, pdf)
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });                                       //**(2)multer parse data when we (1)send file(image) to backend from create listing form then (3)multer stores file(image) in cloudinary storage**
//const upload = multer({ dest: "uploads/"});                             //multer will save files in upload folder(when add from create New Listing) //save in locals for now

// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);                 // under listingSchema's created constaits(validators) are satisfy(applied) on req body or not)
//     if(error) {                                                       //if error occur
//         let errMsg = error.details.map((el) => el.message).join(","); //find errors in details and map them in individual error, and return an individual error msg and seperated by comma
//         throw new ExpressError(400, errMsg);                          //then throw err 
//     } else {
//         next();                                                       //next() method throw err to non handling middleware(in create and update route, where validateListing passed as a middleware)
//     }
// };

//code becomes compact now after add in single route(routing.route)
router.route("/")                                              //adding common paths in single route(routing.route)
.get(wrapAsync (listingController.index))             //when req come on /listings
.post(
    isLoggedIn,                                        
    upload.single("listing[image]"),                  //add upload.single middleware to add image in listing                   
    validateListing,                                  //then check validateListing(passed as a middleware)  , then wrapAsync execute 
    wrapAsync (listingController.createListing)
);
// .post( (req, res) => {         //upload(save) single file(image), when we create listing  
//     res.send(req.file);
// });

//New Route
 router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")                                       //adding common paths in single route(routing.route)
.get(wrapAsync (listingController.showListing))
.put(
    isLoggedIn,                          //(passed as a middleware) 
    isOwner,                             //(passed as a middleware) 
    upload.single("listing[image]"),     //add upload.single middleware to add image in listing
    validateListing,                     //(passed as a middleware) 
    wrapAsync (listingController.updateListing)
)
.delete(
    isLoggedIn, 
    isOwner, 
    wrapAsync (listingController.destroyListing)
);

// // Index Route
// router.get("/", wrapAsync (listingController.index));       //index func execute here after req coming(controller/listing.js)
 
//  // New Route
//  router.get("/new", isLoggedIn, listingController.renderNewForm);
 
//  // Show Route
//  router.get("/:id", wrapAsync (listingController.showListing));
 
 //create Route
//  router.post(
//     "/",
//     isLoggedIn,                                             //when req come on /listings
//     validateListing,                                        //then check validateListing(passed as a middleware)  , then wrapAsync execute 
//     wrapAsync (listingController.createListing));           //wrapAsync is better way for handling errors rather than try-catch block(custom error handling)

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));

// //Update Route
// router.put(
//     "/:id",
//     isLoggedIn,                          //(passed as a middleware) 
//     isOwner,                             //(passed as a middleware) 
//     validateListing,                     //(passed as a middleware) 
//     wrapAsync (listingController.updateListing));

// //Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync (listingController.destroyListing));

module.exports = router;