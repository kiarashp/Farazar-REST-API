const Product = require('../Models/product');
const APIFeatures = require('../utilities/apifeatures')

exports.getAllProducts = async (req, res) => {
    try {
        const features = new APIFeatures(Product.find(), req.query).filter().sort().limitFields().paginate()
        const allProducts = await features.queryMongoose;
        res.status(200).json({
            status: 'success',
            data: {
                allProducts,
            },
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                newProduct,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const theProduct = await Product.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                theProduct,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                updatedProduct,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndRemove(req.params.id)
        res.status(204).json({
            status: 'success',
            message: 'Product deleted',
            data: null,
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }

};
exports.topFiveCheap = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = 'price'
    next()
}

exports.stats = async (req, res) => {
    try {
        const statistics = await Product.aggregate([
            {
                $match: { price: { $gt: 1 } } //match documents which has prices more than 1
            },
            {
                $group: {
                    _id: { $toUpper: '$category' }, //make groups based upon the category
                    totalProducts: { $sum: 1 }, //sum all products in that group
                    averagePrices: { $avg: '$price' }, //average of the price in that group
                    minPrice: { $min: '$price' }, //minimum price of that group
                    maxPrice: { $max: '$price' } //maximum price of that group
                }
            }, { $sort: { totalProducts: 1 } }


        ])
        res.status(200).json({
            status: 'success',
            data: {
                statistics,
            },
        });
    }

    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
}
exports.perYear = async (req, res) => {
    try {
        const year = req.params.year * 1
        const statsPerYear = await Product.aggregate([
            {
                $match: {
                    myDate: // mathch all documents between the specific year in the url
                    {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$myDate' }, //grouping based on the month of the value of createdAt
                    numberofproducts: { $sum: 1 },
                    products: { $push: '$title' }
                }
            }, {
                $addFields: {
                    month: '$_id' //add a field named month with the same value as id
                }
            },
            {
                $project: {
                    _id: 0 //remove id field
                }
            }, {
                $sort: {
                    numberofproducts: 1 //remove id field
                }
            }
        ])
        res.status(200).json({
            status: 'success',
            data: {
                statsPerYear,
            },
        });
    }

    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
}