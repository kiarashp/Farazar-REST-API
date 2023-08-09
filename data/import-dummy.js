const fs = require("fs")
const mongoose = require('mongoose')
const dotenv = require('dotenv');
// const Blog = require("../Models/blog")
const Product = require("../Models/product")



dotenv.config({ path: './config.env' });


const DB = process.env.DATABASE
mongoose.connect(DB).then(() => {
    console.log('db connected sucessfully')
});

//Read the Product dummy
const dummyProduct = JSON.parse(fs.readFileSync(`${__dirname}/dummy-product-data.json`, 'utf-8'))

//write it to the DB
const writeIt = async () => {
    try {
        await Product.create(dummyProduct)
        console.log('dummy Products data successfully added to the database')
        process.exit()

    }
    catch (err) {
        console.log(err)
    }
}

//delete all blogs from the DB
const deleteIt = async () => {
    try {
        await Product.deleteMany({})
        console.log('all products  successfully deleted from the database')
        process.exit()
    }
    catch (err) {
        console.log(err)
    }
}
if (process.argv[2] === "-import") {
    writeIt();
} else if (process.argv[2] === "-delete") {
    deleteIt();
}
console.log(process.argv)