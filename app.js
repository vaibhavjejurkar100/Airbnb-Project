if(process.env.NODE_ENV != "production") {     
    require("dotenv").config();              //we can't directly access environment variaibles/credentials from .env file, for this we have to add npm third party library "dotenv" this library will integrate .env file with backend  //dotenv only use development phase not in production phase
}

//console.log(process.env.SECRET);             // print and access process environments/credentials from .env file

//performing CRUD operations //Basic set up
const express = require("express");
const app = express();
const mongoose = require("mongoose");
//const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");               //require ejs-mate package //ejs-mate use to create multiple template or layouts
//const { runInNewContext } = require("vm");
//const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");             //passport is a npm library which is inbuild(already Created) library to authenticate(verify) User(signUp, Login) into websites, more in user.js
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const { listingSchema, reviewSchema } = require("./Schema.js");
// const Review = require("./models/review.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));  //use for static files

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });

app.use(session(sessionOptions));
app.use(flash());
 
//Configuring Strategy(authentication setup)
app.use(passport.initialize());                            //initialize() password
app.use(passport.session());                               // session is a some amount of time in which user is login, signup into websites, opens multiple tabs and used them, we can also set explicitly session time
passport.use(new LocalStrategy(User.authenticate()));      //we want user are authenticate through LocalStrategy, for to authenticate user, we used User.authenticate() method, authenticate means user is already login or not, signup or not in website //User.authenticate() this is a static method, which add passport-local-mongoose by default

passport.serializeUser(User.serializeUser());            //User.serializedUser method store user info when user in the session
passport.deserializeUser(User.deserializeUser());        //User.deserializedUser method unstore user info when user end the session

app.use((req, res, next) => {                        
    res.locals.success = req.flash("success");           //flash msg pass in middleware
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;                      //user info under req obj store in res.locals.currUser of curruser(the user which are in the session) 
    next();
 });

//Demo user - inserting fakeuser data(email, username, password)
//  app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");  //User.register is a static method, in which we add fakeuser and "helloworld" as a password in fakeuser
//     res.send(registeredUser);
//  });

//validateListing function for server side validation under Joi Schema
// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body); // under listingSchema's created constaits(validators) are satisfy(applied) on req body or not)
//     if(error) {                                       //if error occur
//         let errMsg = error.details.map((el) => el.message).join(","); //find errors in details and map them in individual error, and return an individual error msg and seperated by comma
//         throw new ExpressError(400, errMsg);           //then throw err 
//     } else {
//         next();                                        //next() method throw err to non handling middleware(in create and update route, where validateListing passed as a middleware)
//     }
// };

// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body); 
//     if(error) {                                      
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);           
//     } else {
//         next();                                       
//     }
// };



// // Index Route
// app.get("/listings", wrapAsync (async (req, res) => {
//    const allListings = await Listing.find({});
//         res.render("listings/index.ejs", { allListings });
//         //console.log(res);
//     }));

// // New Route
// app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs");
// });

// // Show Route
// app.get("/listings/:id", wrapAsync (async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", { listing });
// }));

// Create Route
//custom Error Handling- when we don't handle err handling and set price in string then mongoose can't parse string value into number value, then we get validation error
//Add Custom wrapAsync // wrapAsync and custom error handling same way of err handling //wrapAsync is better way for handling errors rather than try-catch block(custom error handling)
// app.post(
//     "/listings",       //when req come on /listings
//     validateListing,   //then check validateListing(passed as a middleware)  , then wrapAsync execute 
//     wrapAsync (async (req, res) => { //wrapAsync is better way for handling errors rather than try-catch block(custom error handling)
//     // try {
//         //let {title, description, image, price, country, location} = req.body;
//         //let listing = req.body.listing;
//         //console.log(listing);

//     // if(!req.body.listing) {      //If request's body under listing not available then throw err
//     //     throw new ExpressError(400, "Send valid data for listing"); // throw ExpressError 
//     // }

//     // let result = listingSchema.validate(req.body); // under listingSchema's created constaits(validators are satisfy(applied) on req body or not)
//     // console.log(result);
//     // if(result.error) {                             // if error come in result
//     //     throw new ExpressError(400, result.error); // then throw err to err handling middleware
//     // }
//     const newListing = new Listing(req.body.listing);   //insert single doc(listing) //req.body.listing access from new.ejs in the form of (javascript object)
//     // if(!newListing.title) {
//     //     throw new ExpressError(400, "Title is missing");       //if under listing object individual field(title) not available then throw err
//     // }
//     // if(!newListing.description) {
//     //     throw new ExpressError(400, "Description is missing"); 
//     // }
//     // if(!newListing.location) {
//     //     throw new ExpressError(400, "Location is missing");
//     // }

//     await newListing.save();
//     res.redirect("/listings");
//     // } catch(err) {
//     //     next(err);  //call for next error handling middleware
//     // } 
//   })
// );

// //Edit Route
// app.get("/listings/:id/edit", wrapAsync (async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
// }));

// //Update Route
// app.put(
//     "/listings/:id", 
//     validateListing, //(passed as a middleware) 
//     wrapAsync (async (req, res) => {
//     // if(!req.body.listing) {      //If request's body under listing not available then throw err
//         // throw new ExpressError(400, "Send valid data for listing"); // throw ExpressError 
//         // }
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });  //deconstruct in object { ...req.body.listing} is a javascript object in which parameters are there, deconstuct this parameters and convert into individual values and passed in updated values
//     res.redirect(`/listings/${id}`);  //redirect in show route
// }));

// //Delete Route
// app.delete("/listings/:id", wrapAsync (async (req, res) => {
//     let { id } = req.params;
//     const deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// }));

app.use("/listings", listingRouter);             //use for listings, under routes/lisitng.js
app.use("/listings/:id/reviews", reviewRouter);  //use for reviews, under routes/review.js //id cannot pass in review.js, under post review route, thats why review not add in listing for that we use (margeparams: true) ///listings/:id/reviews called as parent route
app.use("/", userRouter);                        

//Reviews
//Post Review Route
// app.post("/listings/:id/reviews", validateReview, wrapAsync (async(req, res) => {
//     let listing = await Listing.findById(req.params.id);    //extract id from show.ejs when form submitted
//     let newReview = new Review(req.body.review);            //insert one review //extract reviews(rating, comments) from show.ejs when form submitted and store in newReview

//     listing.reviews.push(newReview);                        //push newReview in listing.js

//     await newReview.save();                                //save in reviews collection
//     await listing.save();                                  //save in listings collection

//     res.redirect(`/listings/${listing._id}`);              //redirect on show page
//     // console.log("new review saved");
//     // res.send("new review saved");            
// }));

// //Delete Review Route
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync (async (req, res) => {
//     let { id, reviewId } = req.params;

//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});  //$pull is a mongoose operator //reviews array(under listingSchema) ke under jis bhi review se hamari reviewId match kare use pull(remove) kar do
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
//   })
// );

//insert doc
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//       title: "My New Villa",
//       description: "By the beach",
//       price: 1200,
//       location: "Calangute, Goa",
//       country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });


app.all("*", (req, res, next) => {                    // "*" is for to match with all incoming request // app.all for those whose route are not match when we found such path(route) in browser
    next(new ExpressError(404, "Page Not Found"));    //next call for next error handling middleware(ExpressError throw err from here)
});

app.use((err, req, res, next) => {                    //this error handling middleware handle above ExpressError(catch above ExpressError) 
    let {statusCode = 500, message = "Something went wrong!"} = err;      //extract statusCode and message from err object receive from ExpressError
    res.status(statusCode).render("error.ejs", { message });
    //res.status(statusCode).res.send(message);               //err send to client
});
// //(Error handling middleware) for custom error handling add custom wrapAsync
// app.use((err, req, res, next) => {
//     res.send("Something went wrong");
// });
   
app.listen(8080, () => {
    console.log("server is listening on port 8080");
});