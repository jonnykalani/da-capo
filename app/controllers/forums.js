'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Forum = models.forum
const Comment = models.comment
const Image = models.image

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  Forum.find().populate('_owner')
    .then(forums => res.json({
      forums: forums.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const indexByUser = (req, res, next) => {
  Forum.find({_owner: req.params.id}).populate('_owner')
    .then(forums => res.json({
      forums: forums.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const show = (req, res, next) => {
  let forum
  let image
  console.log('req.forum.id in forums show ctrl is', req.forum.id)
  Forum.findById(req.forum.id)
    .then(foundForum => {
      forum = foundForum.toObject()
      console.log('forum is', forum)
      return Comment.find({_forum: req.forum.id})
    })
    .then((comments) => {
      forum.comments = comments
      console.log('forum.comments is', forum.comments)
      console.log('forum has been assigned comments', forum.comments)
      return forum
    })
    // .then((forum) => {
    //   console.log('image find is about to happen')
    //   console.log('req._owner.id is', req.user.id)
    //   if (Image.find({_owner: req.user.id})) {
    //     console.log('image is', image)
    //     image = Image.find({_owner: req.user.id})
    //     forum.image = image
    //     console.log('image is', image)
    //     console.log('image._owner is', image._owner)
    //     return forum
    //   } else {
    //     console.log('forum is', forum)
    //     return forum
    //   }
    // })
    .then((forum) => {
      console.log('forum.comments is', forum.comments)
      return res.json({
        forum: forum
      })
    })
    .catch(next)
  // const updatedForum = Object.assign(forum)
  // console.log('forum is', forum) // this is printing before the promises
  // res.json({
  //   forum: req.forum.toJSON({ virtuals: true, user: req.user })
  // })
  // return forum.update(req.body.forum)
}

const create = (req, res, next) => {
  const forum = Object.assign(req.body.forum, {
    _owner: req.user._id
  })
  Forum.create(forum)
    .then(forum =>
      res.status(201)
        .json({
          forum: forum.toJSON({ virtuals: true, user: req.user })
        }))
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body.forum._owner  // disallow owner reassignment.

  req.forum.update(req.body.forum)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.forum.remove()
    .then(() => res.sendStatus(204))
    .catch(next)
}

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
  indexByUser
}, { before: [
  { method: setUser, only: ['index', 'show', 'indexByUser'] },
  { method: authenticate, except: ['index', 'show', 'indexByUser'] },
  { method: setModel(Forum), only: ['show'] },
  { method: setModel(Forum, { forUser: true }), only: ['update', 'destroy'] }
] })
