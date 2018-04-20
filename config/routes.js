'use strict'

module.exports = require('lib/wiring/routes')

// create routes

// what to run for `GET /`
.root('root#root')

// standards RESTful routes
.resources('examples')
.resources('forums', { except: ['destroy'] })
.resources('comments')
.resources('images')

// users of the app have special requirements
.post('/sign-up', 'users#signup')
.post('/sign-in', 'users#signin')
.delete('/sign-out/:id', 'users#signout')
.patch('/change-password/:id', 'users#changepw')
.resources('users', { only: ['index', 'show'] })
.get('/ownedforums/:id', 'forums#indexByUser')
.get('/ownedcomments/:id', 'comments#indexByUser')
.get('/forumcomments/:id', 'comments#indexByForum')
.get('/ownedimages/:id', 'images#indexByUser')
// .get('/forumimages/:id', 'images#indexByUser')

// all routes created
