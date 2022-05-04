const mongoose= require('mongoose')


const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User', 
    },
},{
    timestamps: true
})

module.exports = reviewSchema