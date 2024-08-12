const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);                     // using User.plugin(passportLocalMongoose) this will automatically add(implement) Username, Hashing, Salting and hash passward, thats why we not need to explicitly add these fields in userSchema

module.exports = mongoose.model("User", userSchema);    //creating and exporting User Model(Collection)