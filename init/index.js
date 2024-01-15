const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const dotenv = require("dotenv").config({ path: "../.env" });
const MONGO_URL = process.env.MONGO_URL;

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

const initDB = async () => {
	await Listing.deleteMany({});
	//implemented an owner to each one.
	initData.data = initData.data.map((obj) => ({ ...obj, owner: "65a558b6d66964665709daa8" }));
	let allData = await Listing.insertMany(initData.data);
	console.log(allData);
	console.log("Database reinitialized");
};

initDB();
