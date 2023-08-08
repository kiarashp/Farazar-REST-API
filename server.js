const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(process.env.NODE_ENV);

const DB = process.env.DATABASE
mongoose.connect(DB).then(()=>{
console.log('db connected sucessfully')
  });
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app is listening to the port ${port}...`);
})