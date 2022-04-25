const mongoose = require('mongoose')
const Property = require('./property')

const favoritesSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        favoriteStatus: {
            type: Boolean,
            default: false,
        },
        favorites: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Property'
                }
            ]
        },

    },
    {
		timestamps: true,
        toObject: {virtuals: true},
        toJSON: {virtuals: true}
	}
)