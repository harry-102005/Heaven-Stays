const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");


const ejsMate = require("ejs-mate");

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const bookings=require("./routes/booking.js");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 2. Database Connection
const MONGO_URL = process.env.MONGO_URL;

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => console.log("Connected to DB securely!"))
    .catch((err) => console.log("Database connection error:", err));

// 3. App Settings
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// --- Routes ---
app.get("/", (req, res) => {
    res.redirect("/listings");
});



app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews);
app.use("/listings/:id/bookings",bookings);

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// 4. Server Listener

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});