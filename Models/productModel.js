const mongoose = require('mongoose');
const slugify = require('slugify')
const validator = require('validator')
//first object is the schema definition and the second is obtions including virtual datas and timestamp
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A product must have a Title Bro...'],
    trim: true,
    // validate: [validator.isAlphanumeric, 'only characters are accepted'],
    maxlength: [50, 'the title must have less or equal than 50 characters'],
    minlength: [5, 'the title must have more or equal than 5 characters']

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
    default: "others",
    enum: {
      values: ['ceramic', 'fiber', 'others'],
      message: 'you should choose between three options'
    }
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price Bro...'],
  },
  discount: {
    type: Number,
    //this validator only works on the create , not update and ...
    validate: {
      validator: function (val) {
        return val < this.price
      },
      message: 'The discount number you entered ({VALUE}) should be less than the price'
    }
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
  //each time data is outputted as json or object it will generate virtuals

}
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
productSchema.pre(/^find/, function (next) {
  this.find({ hiddenProduct: { $ne: true } })
  next()

})

// AGGREGATION MIDDLEWARE
//hide hiddenProducts from the aggregare stages
productSchema.pre('aggregate', function (next) {
  //push  the match stage to the begining array of aggregations and force them to not show the hidden products
  this.pipeline().unshift({
    $match: { hiddenProduct: { $ne: true } }
  })
  next()

})

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
