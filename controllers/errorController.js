const AppError = require('../utilities/appError')

const developmentModErr = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}
const productionModErr = (err, res) => {
  // if the err is operational it will show the status code and the message
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    // console.log('The unexpcted Eror: ', err)
    // else we only show this message
    res.status(500).json({
      status: 'error',
      message: 'Unfortunately something went wrong!!!',
      err: err.name,
      op: err.isOperational
    })
  }
}
const castErrorHandler = (err)=>{
  err.statusCode = 400
  err.status = 'fail'
  err.message = `You added an invalid value ${err.value} for this field ${err.path})`
  err.isOperational = true
}
const JwtErrorHandler = (err)=>{
  err.message = 'invalid Token. Please login and try again.'
  err.statusCode = 401
  err.isOperational = true
}
const JwtExpiredErrorHandler = (err)=>{
  err.message = 'The Token has been expired. Please login and try again.'
  err.statusCode = 401
  err.isOperational = true
}
const ValidationErrorHandler = (err)=>{
  errarray = Object.values(err.errors).map(el=>{
    return el.message
  })
  err.statusCode = 400
  err.status = 'fail'
  err.message = `You entered an invalid data. ${errarray.join(', ')}`
  err.isOperational = true
}

module.exports = ((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  if (process.env.NODE_ENV === 'development') {
    developmentModErr(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') castErrorHandler(err)
    if (err.name === 'ValidationError') ValidationErrorHandler(err)
    if( err.name === 'JsonWebTokenError') JwtErrorHandler(err)
    if( err.name === 'TokenExpiredError') JwtExpiredErrorHandler(err)

    productionModErr(err, res)
  }
})