const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A Blog must have a Title Bro...'],
  },
  content: {
    type: String,
    required: [true, 'A Blog must have a content dude!'],
  },
  mainImage: {
    type: String,
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
