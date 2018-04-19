'use strict'

const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  _forum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret, options) {
      const userId = (options.user && options.user._id) || false
      ret.editable = userId && userId.equals(doc._owner)
      return ret
    }
  }
})

// blogPostSchema.virtual('length').get(function length () {
//   return this.text.length
// })

const BlogPost = mongoose.model('Comment', commentSchema)

module.exports = BlogPost
