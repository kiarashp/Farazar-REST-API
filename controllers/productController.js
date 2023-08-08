const Product = require('../Models/product');

exports.getAllProducts = async (req, res) => {
    try {
        // Firt step for the filtering
        const filterquery = { ...req.query }// make a new object, Don't touch the real query
        const excludedFields = ['page', 'sort', 'limit', 'fields']// remove these fields from the query
        excludedFields.forEach(element => {
            delete filterquery[element]
        });
        // Second step for the filtering
        let strQue = JSON.stringify(filterquery)
        strQue = strQue.replace(/\b(gte|gt|lte|lt)\b/g, match => '$' + match)
        
        let query = Product.find(JSON.parse(strQue))

        // Sorting
        if (req.query.sort){
            const querySorted = req.query.sort.split(',').join(' ')
            query = query.sort(querySorted)
        }else {
            query.sort('-createdAt')
        }
        // Calling query
        const allProducts = await query;
        res.status(200).json({
            status: 'success',
            data: {
                allProducts,
            },
        });
    } catch (err) {
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
