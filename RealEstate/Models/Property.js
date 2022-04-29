const mongoose = require('mongoose')

const PropertySchema = mongoose.Schema({
    propertyAddress: {
        address: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true}
    },

    propertyAttributes: {
        price: {type: Number, required: true},
        isSaleOrRent: {type: String, required: true},
        numOfBedrooms: {type: String, required: true},
        numOfBathrooms: {type: String, required: true},
        numOfGarages: {type: String, required: true},

    }

})

module.exports = mongoose.model('Property', PropertySchema)