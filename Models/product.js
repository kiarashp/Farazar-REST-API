const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A product must have a Title Bro...'],
  },
  content: {
    type: String,
    required: [true, 'A product must have a content dude!'],
  },
  category: {
    type: String,
    default: "others"
  },
  price:{
    type: Number,
    required: [true, 'A product must have a price Bro...'],
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
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
