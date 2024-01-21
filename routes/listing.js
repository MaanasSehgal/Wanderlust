const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")

const listingController = require("../controllers/listings.js")
//Index route - Shows all listings
router.get("/", wrapAsync(listingController.index))

//New route
router.get("/new", isLoggedIn, listingController.renderNewForm)

//Show route - Show all data of a particular listing
router.get("/:id", wrapAsync(listingController.showListing))

//Post route
router.post(
    "/",
    validateListing,
    isLoggedIn,
    wrapAsync(listingController.createListing)
)

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm))

//update route
router.patch(
    "/:id",
    validateListing,
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.updateListing)
)

//delete route
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing))

module.exports = router
