// import our dependecies, middleware and models 
const express = require('express')
const passport = require('passport')
const Property = require('../models/property')
const customErrors = require('../../lib/custom_errors')

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
            // push the message to the property
            property.message.push(message)
            // save the property
            return property.save()
        })
})

// DELETE - Delete a message in the database
// DELETE - /messages/propertyId/messageId
router.delete('/messages/:propertyId/:messageId', requireToken, (req, res, next) => {
    const messageId = req.params.messageId
    const propertyId = req.params.propertyId

    Property.findById(propertyId)
        // If property not found, throw 404
        .then(handle404)
        .then(property => {
            // get the specific subdocument by its id
            const message = property.messages.id(messageId)
            // require ownership of the message to delete
            requireOwnership(req, property)
            // remove the message
            message.remove()

            // return the saved property
            return property.save()
        })
        // if successful, send 204 status
        .then(() => res.sendStatus(204))
        // if error, send to error handler
        .catch(next)
})

module.exports = router