// import our dependecies, middleware and models 
const express = require('express')
const passport = require('passport')
const Property = require('../models/property')
const customErrors = require('../../lib/custom_errors')
const User = require('../models/user')
const Message = require('../models/messages')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate('bearer', { session: false })
const removeBlanks = require('../../lib/remove_blank_fields')

const router = express.Router()

/******************** ROUTES *******************/

// POST - Create a message in the database
// POST - /messages/:propertyid
router.post('/messages/:propertyId', (req, res, next) => {
    // get message from req.body and save to variable
    const message = req.body.message
    /// get propertyid from req.params and save to variable
    const propertyId = req.params.propertyId
    Property.findById(propertyId)
        // handle what happens if no message is found
        .then(handle404)
        .then(property => {
            console.log('this is the property', property)
            console.log('this is the message', message)
            // find user by property owner id
            User.findById(property.owner._id)
                .then(user => {
                    // push the message to the user messages array
                    user.messages.push(message)
                    // save the user data
                    return user.save()
                })
        .then(user => res.status(201).json({ user: user }))
        .catch(next)
        })
})

// DELETE - Delete a message in the database
// DELETE - /messages/propertyId/messageId
router.delete('/messages/:userId/:messageId', requireToken, (req, res, next) => {
    // get messageId from params
    const messageId = req.params.messageId
    console.log('this is messageId', messageId)
    // get userId from params
    const userId = req.params.userId
    console.log('this is property id', userId)

    User.findById(userId)
        // If property not found, throw 404
        .then(handle404)
        .then(user => {
            // get the specific subdocument by its id
            const messages = user.messages
            console.log('this is messages', messages)
            
            // require ownership of the message to delete
            // requireOwnership(req, messages)

            // find the index of the message by the id and splice it out of the array
            const indexMessage = messages.map((message) => message._id).indexOf(messageId)
            const removedMessage = indexMessage && messages.splice(indexMessage, 1)
            console.log('removedMessage', removedMessage)
            
            // return the saved user
            return user.save()
        })
        // if successful, send 204 status
        .then(() => res.sendStatus(204))
        // if error, send to error handler
        .catch(next)
})

module.exports = router