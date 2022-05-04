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

// POST - Create a review in the database
// POST - /reviews/:propertyid
router.post('/reviews/:propertyId', (req, res, next) => {
    // get review from req.body and save to variable
    const review = req.body.review
    /// get propertyid from req.params and save to variable
    const propertyId = req.params.propertyId
    Property.findById(propertyId)
        // handle what happens if no review is found
        .then(handle404)
        .then(property => {
            console.log('this is the property', property)
            console.log('this is the review', review)
            // push the review to the property
            property.reviews.push(review)
            // save the property
            return property.save()
        })


})

// DELETE - Delete a review in the database
// DELETE - /reviews/propertyId/reviewId
router.delete('/reviews/:propertyId/:reviewId', requireToken, (req, res, next) => {
    const reviewId = req.params.reviewId
    const propertyId = req.params.propertyId

    Property.findById(propertyId)
        // If property not found, throw 404
        .then(handle404)
        .then(property => {
            // get the specific subdocument by its id
            const review = property.reviews.id(reviewId)
            // require ownership of the review to delete
            requireOwnership(req, property)
            // remove the review
            review.remove()

            // return the saved property
            return property.save()
        })
        // if successful, send 204 status
        .then(() => res.sendStatus(204))
        // if error, send to error handler
        .catch(next)
})

module.exports = router