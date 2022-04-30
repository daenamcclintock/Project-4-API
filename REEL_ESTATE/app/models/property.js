const mongoose = require('mongoose')

const reviewSchema = require('./review')

const propertySchema = new mongoose.Schema(
	{
		address: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		bedrooms: {
			type: Number,
			required: true,
		},
		bathrooms: {
			type: Number,
			required: true,
		},
		squareFootage: {
			type: Number,
			required: true,
		},
		image1: {
			type: String,
			default: '../imgs/image.png'
		},
		image2: {
			type: String,
			default: '../imgs/image.png'
		},
		image3: {
			type: String,
			default: '../imgs/image.png'
		},
		image4: {
			type: String,
			default: '../imgs/image.png'
		},
		image5: {
			type: String,
			default: '../imgs/image.png'
		},
		amenities: {
			type: Array,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		reviews: [reviewSchema],
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Property', propertySchema)
