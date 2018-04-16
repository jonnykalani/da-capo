'use strict'

const mongoose = require('mongoose')

const forumSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  tags: [String],
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

// forumSchema.virtual('length').get(function length () {
//   return this.text.length
// })

const Forum = mongoose.model('Forum', forumSchema)

module.exports = Forum
