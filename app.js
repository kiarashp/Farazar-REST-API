const express = require('express');
const morgan = require('morgan');

const blogRouter = require('./routes/blogRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes')

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

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);


module.exports = app;
