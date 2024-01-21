const Listing = require("../models/listing")
const Review = require("../models/review")

module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    //the req.body.review is the object given when the show.ejs review form is submitted
    //this will add a new review to the reviews array
    newReview.author = req.user._id
    // console.log(newReview);
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()
    req.flash("success", "New Review Created!")
    res.redirect(`/listings/${listing._id}`)
}

module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Review Deleted!")

    res.redirect(`/listings/${id}`)
}
