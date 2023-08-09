        
        class APIFeatures {
            constructor(queryMongoose, queryExpress) {
                this.queryMongoose = queryMongoose
                this.queryExpress = queryExpress
            }
            filter() {
                const filterquery = { ...this.queryExpress }// make a new object, Don't touch the real Express query
                const excludedFields = ['page', 'sort', 'limit', 'fields']// remove these fields from the query
                excludedFields.forEach(element => {
                    delete filterquery[element]
                });
                let strQue = JSON.stringify(filterquery)
                strQue = strQue.replace(/\b(gte|gt|lte|lt)\b/g, match => '$' + match)
                this.queryMongoose = this.queryMongoose.find(JSON.parse(strQue))
                return this
            }
            sort() {
                if (this.queryExpress.sort) {
                    const querySorted = this.queryExpress.sort.split(',').join(' ')
                    this.queryMongoose = this.queryMongoose.sort(querySorted)
                } else {
                    this.queryMongoose = this.queryMongoose.sort('-createdAt')
                }
                return this
            }
            limitFields() {
                if (this.queryExpress.fields) {
                    const queryprojectioned = this.queryExpress.fields.split(',').join(' ')
                    this.queryMongoose = this.queryMongoose.select(queryprojectioned)
                } else {
                    this.queryMongoose = this.queryMongoose.select('-__v')
                }
                return this
            }
            paginate() {
                const page = this.queryExpress.page * 1 || 1
                const limit = this.queryExpress.limit * 1 || 100
                const skip = (page - 1) * limit
                this.queryMongoose = this.queryMongoose.skip(skip).limit(limit)
                return this
            }
        }
        module.exports = APIFeatures
        
        // Firt step for the filtering
        // const filterquery = { ...req.query }// make a new object, Don't touch the real query
        // const excludedFields = ['page', 'sort', 'limit', 'fields']// remove these fields from the query
        // excludedFields.forEach(element => {
        //     delete filterquery[element]
        // });
        // let strQue = JSON.stringify(filterquery)
        // strQue = strQue.replace(/\b(gte|gt|lte|lt)\b/g, match => '$' + match)
        // let query = Product.find(JSON.parse(strQue))

        // Sorting
        // if (req.query.sort) {
        //     const querySorted = req.query.sort.split(',').join(' ')
        //     query = query.sort(querySorted)
        // } else {
        //     query.sort('-createdAt')
        // }

        // Field limiting
        // if (req.query.fields) {
        //     const queryprojectioned = req.query.fields.split(',').join(' ')
        //     query = query.select(queryprojectioned)
        // } else {
        //     query = query.select('-__v')
        // }
        // // Pagination
        // const page = req.query.page * 1 || 1
        // const limit = req.query.limit * 1 || 3
        // const skip = (page - 1) * limit
        // query = query.skip(skip).limit(limit)

        // if (req.query.page) {
        //     const totDocument = await Product.countDocuments()
        //     console.log(skip, totDocument)
        //     if (skip >= totDocument) throw new Error('this page does not exist')
        // }