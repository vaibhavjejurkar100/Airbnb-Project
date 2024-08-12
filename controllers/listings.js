//Adding listing routes (callback) here in controller //reformating, restructuring of routes for better readiablility
const { query } = require("express");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {           //index func render all listings
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);
    // if(!req.isAuthenticated()) {
    //     req.flash("error", "you must be logged in to create listing!");
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
       .populate({ path:"reviews",
         populate: { path: "author",
         },
       })
       .populate("owner");      //.populate("owner") -> show users in detail
    if(!listing) {
       req.flash("error", "Listing you requested for does not exist!");
       res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => { 
    //converting addresses into geographic coordinates(latitude, longitude)
    let response = await geocodingClient.forwardGeocode({    //forwardGeocode means finding cordinates from place
        query: req.body.listing.location,
        //query: "New Delhi, India",
        limit: 1,
        }).send();
    
    //console.log(response.body.features[0].geometry);
    //res.send("done!");


    let url = req.file.path;                            //extract path from req.file
    let filename = req.file.filename;                   // //extract filename from req.file
    // console.log(url, "..", filename); 
    const newListing = new Listing(req.body.listing);   //insert single doc(listing) //req.body.listing access from new.ejs in the form of (ja vascript object)
    newListing.owner = req.user._id;                    //current user id save in newListing.owner(listing), when create new listing
    newListing.image = {url, filename};                 //add url, filename in mongodb database  //save link in mongo

    newListing.geometry = response.body.features[0].geometry;  //adding geometry(type, coordinates) in listing

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
// } catch(err) {
//     next(err);                                       //call for next error handling middleware
// } 
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    //image preview for Edit Page
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");   //change in original image(link) after /upload, /upload replace with /upload/w_250 (set width to 250)
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    // if(!req.body.listing) {                                          //If request's body under listing not available then throw err
        // throw new ExpressError(400, "Send valid data for listing");  // throw ExpressError 
        // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });         //deconstruct in object { ...req.body.listing} is a javascript object in which parameters are there, deconstuct this parameters and convert into individual values and passed in updated values

    //Edit Listing Image
    if(typeof req.file != "undefined") {                    //if file exist in req.file then only image add in listing(we update image in edit page(edit.ejs)) //typeof is a js operator for checking values undefined or not
        let url = req.file.path;                            //extract path from req.file
        let filename = req.file.filename;                   // //extract filename from req.file
        listing.image = {url, filename};                    //add url, filename in mongodb database  //save link in mongo
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);                    //redirect in show route
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};
     