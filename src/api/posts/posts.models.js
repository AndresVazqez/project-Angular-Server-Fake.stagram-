const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    image: { type: String, required: true, trime: true},
    caption: { type: String},
    userId: {type: Schema.Types.ObjectId, ref: 'users'}
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model('posts', postSchema)
module.exports = Post
