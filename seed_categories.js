const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const MONGO_URL = "mongodb://admin:harry2005@127.0.0.1:27017/heavenstays?authSource=admin";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    const categories = ['Trending', 'Rooms', 'Iconic Cities', 'Mountains', 'Castles', 'Amazing Pools', 'Camping', 'Farms', 'Arctic'];
    
    const listings = await Listing.find({ category: { $exists: false } });
    console.log(`Found ${listings.length} listings without category`);

    for (let listing of listings) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        listing.category = randomCategory;
        await listing.save();
    }
    
    const emptyListings = await Listing.find({ category: { $in: [null, "", "Trending"] } }); // Re-randomize Trending just in case
    console.log(`Found ${emptyListings.length} listings with empty/null/Trending category`);
    for (let listing of emptyListings) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        listing.category = randomCategory;
        await listing.save();
    }

    console.log("Database update complete.");
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
