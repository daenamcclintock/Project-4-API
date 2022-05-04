const mongoose= require('mongoose')


const messageSchema = new mongoose.Schema({
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: Number
    },
    message: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User', 
    },
    // property: {
    //     type: mongoose.Schema.Types.PropertyID,
    //     ref:'Property'
    // }
},{
    timestamps: true
})

module.exports = messageSchema