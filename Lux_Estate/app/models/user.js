const mongoose = require('mongoose')

const messageSchema = require('./messages')

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
		},
		lastName: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		hashedPassword: {
			type: String,
			required: true,
		},
		messages: [messageSchema],
		token: String,
	},
	{
		timestamps: true,
		toObject: {
			// remove `hashedPassword` field when we call `.toObject`
			transform: (_doc, user) => {
				delete user.hashedPassword
				return user
			},
		},
		toObject: {virtuals: true},
		toJSON: {virtuals: true}
	}
)

userSchema.virtual('fullName').get(function() {
	return `${this.firstName} ${this.lastName}`
})

module.exports = mongoose.model('User', userSchema)
