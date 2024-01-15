const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//Index route - Shows all listings
router.get(
	"/",
	wrapAsync(async (req, res) => {
		const listings = await Listing.find({});
		res.render("listings/index.ejs", { listings });
	}),
);

//New route
router.get("/new", isLoggedIn, (req, res) => {
	res.render("listings/new.ejs");
});

router.post(
	"/",
	validateListing,
	isLoggedIn,
	wrapAsync(async (req, res, next) => {
		const newListing = new Listing(req.body.listing);
		newListing.owner = req.user._id;
		// console.log(req.user);
		await newListing.save();
		req.flash("success", "New Listing Created!");
		res.redirect("/listings");
	}),
);

//Show route - Show all data of a particular listing
router.get(
	"/:id",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listing = await Listing.findById(id)
			.populate({
				path: "reviews",
				populate: {
					path: "author",
				},
			})
			.populate("owner");
		if (!listing) {
			req.flash("error", "Listing you requested for does not exist!");
			res.redirect("/listings");
		}
		console.log(listing);
		res.render("listings/show.ejs", { listing });
	}),
);

//edit route
router.get(
	"/:id/edit",
	isLoggedIn,
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listing = await Listing.findById(id);
		if (!listing) {
			req.flash("error", "Listing you requested for does not exist!");
			res.redirect("/listings");
		}
		res.render("listings/edit.ejs", { listing });
	}),
);

//update route
router.patch(
	"/:id",
	validateListing,
	isLoggedIn,
	isOwner,
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		await Listing.findByIdAndUpdate(id, { ...req.body.listing });
		req.flash("success", "Listing Updated!");
		res.redirect(`/listings/${id}`);
	}),
);

//delete route
router.delete(
	"/:id",
	isLoggedIn,
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		await Listing.findByIdAndDelete(id);
		req.flash("success", "Listing Deleted!");
		res.redirect("/listings");
	}),
);

module.exports = router;
