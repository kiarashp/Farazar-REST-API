const mongoose = require('mongoose');
const slugify = require('slugify')
//first object is the schema definition and the second is virtual datas, the third is for timestamp
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A product must have a Title Bro...'],
  },
  hiddenProduct: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String
  },
  content: {
    type: String,
    required: [true, 'A product must have a content dude!'],
  },
  category: {
    type: String,
    default: "others"
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price Bro...'],
  },
  mainImage: {
    type: String,
  },
  images: [String],
  myDate: {
    type: Date,
    default: new Date()
  },
  createdBy: {
    type: String,
    default: 'admin',
    select: false //hidden this field from getting it thorugh the api
  }
}, {
  toJSON: { virtuals: true }, //each time data is outputted as json or object it will generate virtuals
  toObject: { virtuals: true }
}
,{ timestamps: true }
);

//creating a virtula properties which will generate everytime a request comes
productSchema.virtual('Orginal Price was this').get(function () {
  return this.price
  
})
//DOCUMENT MIDDLEWARE : runs before .save() or .create()
// before save a data in mongodb this middleware or hook will run
productSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true })
  next()
})
//after saving a data in mongodb this middleware or hook will run
// productSchema.post('save', function (next) {
// //sending email or sms to the manager ro alert them about the newly product aded
//   next()
// })
// QUERY MIDDLEWARE
// everywhere we use find or findbyid and... it shows not true hidden products => just show the false ones.
productSchema.pre(/^find/,function(next){
  this.find({hiddenProduct: {$ne: true}})
  next()

})

// AGGREGATION MIDDLEWARE
//hide hiddenProducts from the aggregare stages
productSchema.pre('aggregate',function(next){
  //push  the match stage to the begining array of aggregations and force them to not show the hidden products
  this.pipeline().unshift({
    $match: { hiddenProduct: {$ne: true}}
  })
  next()

})
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
