const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js");

const defaultImage = "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d";

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: defaultImage, // Handles undefined / missing fields
        set: (v) => (v === "" ? defaultImage : v), // Handles explicit empty strings from forms
    },
    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        enum: ['Trending', 'Rooms', 'Iconic Cities', 'Mountains', 'Castles', 'Amazing Pools', 'Camping', 'Farms', 'Arctic'],
        default: 'Trending'
    },
    reviews:[
    {
        type:Schema.Types.ObjectId, 
        ref:"Review",

    },
],
});

listingSchema.post("findOneAndDelete",async(listing)=>
{
    if(listing)
    {
        await Review.deleteMany({_id:{$in:listingSchema.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;