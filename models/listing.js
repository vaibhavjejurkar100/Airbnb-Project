//listing model
//creating Schema(listingSchema)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews : [ 
        {
            type: Schema.Types.ObjectId,        //add objectId of reviews in listingSchema
            ref: "Review",                     //from Reviews model(collection)
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    //storing cordinates into databases
    geometry: {
        type: {
            type: String, // Don't do `{location: {type: String }}`
            enum: ["Point"], //'location.type' must be point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

//Handling Deletion - Delete reviews(under listing) when listing was delete
listingSchema.post("findOneAndDelete", async (listing) => { //listingSchema.post middleware call after listing was deleting(delete route) //delete revirews under listing's reviews array
    if(listing) {  //if listing exist
        await Review.deleteMany({_id: { $in: listing.reviews }});  //listing.reviews array ke under jitni bhi reviews id hai unki ek list banegi, aur jo _id(reviews' id(under reviews collection)) listing.reviews ki id ke sath match karegi use delete karenge
    }
});

//creating model(collection)- (listing)
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;       