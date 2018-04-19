'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Comment = models.comment
const Forum = models.forum

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')
const mongoose = require('mongoose')

const index = (req, res, next) => {
  Comment.find().populate('_owner')
    .then(comments => res.json({
      comments: comments.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const indexByUser = (req, res, next) => {
  Comment.find({_owner: req.params.id}).populate('_owner')
    .then(comments => res.json({
      comments: comments.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const indexByForum = (req, res, next) => {
  Comment.find({_forum: req.params.id}).populate('_forum')
    .then(comments => res.json({
      comments: comments.map((e) =>
        e.toJSON({ virtuals: true, forum: req.forum }))
    }))
    .catch(next)
}

const show = (req, res) => {
  res.json({
    comment: req.comment.toJSON({ virtuals: true, user: req.user })
  })
}

const create = (req, res, next) => {
  console.log('req.body.comment.forum is', req.body.comment.forum)
  console.log('req.body.comment is', req.body.comment)
  const comment = Object.assign(req.body.comment, {
    _owner: req.user._id,
    _forum: new mongoose.Types.ObjectId(req.body.comment.forum)
  })
  Comment.create(comment)
    .then(comment =>
      res.status(201)
        .json({
          comment: comment.toJSON({ virtuals: true, user: req.user })
        }))
        .then(() => {
          console.log('comment._forum is', comment._forum)
          console.log('comment.body is', comment.body)
          console.log('comment.id is', comment._id)
        })
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body.comment._owner  // disallow owner reassignment.

  req.comment.update(req.body.comment)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.comment.remove()
    .then(() => res.sendStatus(204))
    .catch(next)
}

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
  indexByUser,
  indexByForum
}, { before: [
  { method: setUser, only: ['index', 'show', 'indexByUser', 'indexByForum'] },
  { method: authenticate, except: ['index', 'show', 'indexByUser', 'indexByForum'] },
  { method: setModel(Comment), only: ['show'] },
  { method: setModel(Comment, { forUser: true }), only: ['update', 'destroy'] }
] })
