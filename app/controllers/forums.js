'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Forum = models.forum

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

const show = (req, res) => {
  res.json({
    forum: req.forum.toJSON({ virtuals: true, user: req.user })
  })
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
