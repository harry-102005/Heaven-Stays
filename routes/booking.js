const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");
const Booking = require("../models/booking.js");
const { bookingSchema } = require("../Schema.js");
const Listing = require("../models/listing.js");

const validateBooking = (req, res, next) => {
    let { error } = bookingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// POST Booking Route
router.post("/", validateBooking, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newBooking = new Booking(req.body.booking);
    
    listing.bookings.push(newBooking);
    
    await newBooking.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

module.exports = router;
