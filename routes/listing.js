const express=require("express");
const router=express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const { listingSchema } = require("../Schema.js");
const ExpressError = require("../util/ExpressError.js");
const Listing = require("../models/listing.js");


const validateListing=(req,res,next)=>
{
 let {error} = listingSchema.validate(req.body);
    


    if (error) {
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else
    {
        next();
    }
    
}


//Index Route
router.get("/", wrapAsync(async (req, res) => {
    let filter = {};
    if (req.query.category && req.query.category !== 'All') {
        filter.category = req.query.category;
    }
    if (req.query.location) {
        filter.$or = [
            { location: { $regex: req.query.location, $options: 'i' } },
            { country: { $regex: req.query.location, $options: 'i' } },
            { title: { $regex: req.query.location, $options: 'i' } }
        ];
    }
    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", { allListings, activeCategory: req.query.category || 'All' });
}));

//new
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});
//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");/*replace a referenced ObjectId with the actual document data from another collection.*/
    res.render("listings/show.ejs", { listing });
}));


// Create Route
// Create Route
router.post("/",validateListing,
     wrapAsync(async (req, res, next) => {
    
    // Pass the undefined req.body directly to Joi
   
    const newListing = new Listing(req.body.listing);
    await newListing.save(); 
    res.redirect("/listings");
}));
// Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

// Update Route
router.put("/:id",validateListing,
    wrapAsync(async (req, res) => {
    
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true }); 
    res.redirect(`/listings/${id}`);
}));

// DELETE Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


module.exports=router;