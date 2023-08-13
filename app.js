const express = require('express');
const morgan = require('morgan');

const blogRouter = require('./routes/blogRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes')
const AppError = require('./utilities/appError')
const globalErrorHandler = require('./controllers/errorController')

const app = express();

if (process.env.Node_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('hello i am a middleware🐭');
  next();
});

app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.all('*', (req, res, next) => {
  // const err = new Error(`The url you tried to access ${req.originalUrl} is not on this server`)
  // err.status = 'fail'
  // err.statusCode = 404
  next(new AppError(`The url you tried to access ${req.originalUrl} is not on this server`,404))
})
app.use(globalErrorHandler) 


module.exports = app;
