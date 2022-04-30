// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for properties
const Property = require('../models/property')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { property: { title: '', text: 'foo' } } -> { property: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /properties
router.get('/properties', (req, res, next) => {
	Property.find()
		.populate('owner')
		.then((properties) => {
			// `properties` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return properties.map((properties) => properties.toObject())
		})
		// respond with status 200 and JSON of the properties
		.then((properties) => res.status(200).json({ properties: properties }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// GET - Route to show all properties owned by the currently logged in user
// MINE -> /properties/mine
router.get('/properties/mine', requireToken, (req, res, next) => {
	console.log('this is the owner: ', req.user._id)
	Property.find({ owner: req.user.id })
		.populate('owner')
		.then(properties => {
			console.log('these are the properties: ', properties)
			return properties.map(property => property.toObject())
		})
		// respond with status 200 and JSON of the properties
		.then((properties) => res.status(200).json({ properties: properties }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// SHOW - Route for property show page
// GET /properties/5a7db6c74d55bc51bdf39793
router.get('/properties/:id', (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Property.findById(req.params.id)
		.populate('owner')
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "property" JSON
		.then((property) => res.status(200).json({ property: property.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE - Allows users to create a new property
// POST /properties
router.post('/properties', requireToken, (req, res, next) => {
	// set owner of new property to be current user
	req.body.properties.owner = req.user.id

	Property.create(req.body.properties)
		// respond to succesful `create` with status 201 and JSON of new "property"
		.then((property) => {
			res.status(201).json({ property: property.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the erro message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// UPDATE - Allows users to edit their property
// PATCH /properties/5a7db6c74d55bc51bdf39793
router.patch('/properties/:id/edit', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	delete req.body.properties.owner

	Property.findById(req.params.id)
		.then(handle404)
		.then((property) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			requireOwnership(req, property)

			// pass the result of Mongoose's `.update` to the next `.then`
			return property.updateOne(req.body.properties)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// DESTROY
// DELETE /properties/5a7db6c74d55bc51bdf39793
router.delete('/properties/:id', requireToken, (req, res, next) => {
	Property.findById(req.params.id)
		.then(handle404)
		.then((property) => {
			// throw an error if current user doesn't own `property`
			requireOwnership(req, property)
			// delete the property ONLY IF the above didn't throw
			property.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// POST - Route to push properties to the favoriteProperties array
// CREATE -> POST /properties/propertyId
router.post('/properties/:propertyId', requireToken, (req, res, next) => {
	req.body.owner = req.user.id
	console.log('this is the owner id: ', req.body.owner)
	console.log('req.body :', req.body)

	const propertyId = req.params.propertyId

	// Find the favoriteProperties array that belongs to the currently logged in user
	FavoriteProperties.find({ owner: req.body.owner })
		.then(handle404)
		.then( favorites => {
			console.log('this is the property id: ', propertyId)
			console.log('this is the array of favorite properties: ', favorites)
			console.log('this is the favoriteProperties: ', favorites[0])

			favorites[0].favoriteProperties.push(propertyId)
			favorites[0].quantity++
			return favorites[0].save()
		})
})

module.exports = router
