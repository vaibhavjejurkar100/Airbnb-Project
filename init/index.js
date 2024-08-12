//initialize database
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

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

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "664cb21627b254a99943f79c"})); //data.map fun store owner property(id) in all listing object //{...obj, owner: "664cb21627b254a99943f79c"} owner id passed in listing obj
    await Listing.insertMany(initData.data);                  //.data access from data.js
    console.log("data was initialized");
};

initDB();