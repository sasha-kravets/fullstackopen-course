const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  url: String,
  title: String,
  author: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: { type: Number, default: 0 },
  comments: [
    {
      comment: String,
    },
  ],
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    returnedObject.comments = returnedObject.comments || []

    returnedObject.comments.forEach((comment) => {
      comment.id = comment._id.toString()
      delete comment._id
      delete comment.__v
      return comment
    })
  },
})

module.exports = mongoose.model('Blog', blogSchema)
