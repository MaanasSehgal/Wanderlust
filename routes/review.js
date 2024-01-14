const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview } = require("../middleware.js");

// Reviews Post route
router.post(
	"/",
	validateReview,
	wrapAsync(async (req, res) => {
		const listing = await Listing.findById(req.params.id);
		let newReview = new Review(req.body.review);
		//the req.body.review is the object given when the show.ejs review form is submitted
		//this will add a new review to the reviews array
		listing.reviews.push(newReview);
		await newReview.save();
		await listing.save();
		req.flash("success", "New Review Created!");
		res.redirect(`/listings/${listing._id}`);
	}),
);

//Delete review route
router.delete(
	"/:reviewId",
	wrapAsync(async (req, res) => {
		let { id, reviewId } = req.params;
		await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		req.flash("success", "Review Deleted!");

		res.redirect(`/listings/${id}`);
	}),
);

module.exports = router;
