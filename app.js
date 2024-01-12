const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv").config();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

const sessionOptions = {
	secret: "mysupersecretcode",
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	},
};

app.get("/", (req, res) => {
	res.send("Root is working");
});

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/", userRouter);

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
	.then(() => {
		console.log("Successfully connected with DB");
	})
	.catch((err) => {
		console.log(err);
	});

async function main() {
	await mongoose.connect(MONGO_URL);
}

<<<<<<< HEAD
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.get("/demouser", async (req, res) => {
	let fakeUser = new User({
		email: "student1@gmail.com",
		username: "delta1-student",
	});

	let registeredUser = await User.register(fakeUser, "helloworld");
	console.log(registeredUser);
	res.send(registeredUser);
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
=======
app.get("/", (req, res) => {
	res.send("Root is working");
});

const validateListing = (req, res, next) => {
	let { error } = listingSchema.validate(req.body);
	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};

const validateReview = (req, res, next) => {
	let { error } = reviewSchema.validate(req.body);
	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};

//Index route - Shows all listings
app.get(
	"/listings",
	wrapAsync(async (req, res) => {
		const listings = await Listing.find({});
		res.render("listings/index.ejs", { listings });
	}),
);

//Create route
app.get("/listings/new", (req, res) => {
	res.render("listings/new.ejs");
});

app.post(
	"/listings",
	validateListing,
	wrapAsync(async (req, res, next) => {
		const newListing = new Listing(req.body.listing);
		await newListing.save();
		res.redirect("/listings");
	}),
);

//Show route - Show all data of a particular listing
app.get(
	"/listings/:id",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listing = await Listing.findById(id).populate("reviews");
		// console.log(listing);
		res.render("listings/show.ejs", { listing });
	}),
);

//edit route
app.get(
	"/listings/:id/edit",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listing = await Listing.findById(id);
		res.render("listings/edit.ejs", { listing });
	}),
);

app.patch(
	"/listings/:id",
	validateListing,
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		await Listing.findByIdAndUpdate(id, { ...req.body.listing });
		res.redirect(`/listings/${id}`);
	}),
);

//delete route
app.delete(
	"/listings/:id",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		await Listing.findByIdAndDelete(id);
		res.redirect("/listings");
	}),
);

// Reviews Post route
app.post(
	"/listings/:id/reviews",
	validateReview,
	wrapAsync(async (req, res) => {
		const listing = await Listing.findById(req.params.id);
		let newReview = new Review(req.body.review);
		//the req.body.review is the object given when the show.ejs review form is submitted
		//this will add a new review to the reviews array
		listing.reviews.push(newReview);
		await newReview.save();
		await listing.save();

		res.redirect(`/listings/${listing._id}`);
	}),
);

//Delete review route
app.delete(
	"/listings/:id/reviews/:reviewId",
	wrapAsync(async (req, res) => {
		let { id, reviewId } = req.params;
		await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);

		res.redirect(`/listings/${id}`);
	}),
);
>>>>>>> 3cf36cc0954368fc2ee8eae22f9a705514cf1bd1

app.all("*", (req, res, next) => {
	next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
	let { statusCode = 500, message = "Something went wrong" } = err;
	// res.status(statusCode).send(message);
	res.status(statusCode).render("error.ejs", { err });
});

app.listen(PORT, () => {
	console.log("Server is listening to port:", PORT);
});
