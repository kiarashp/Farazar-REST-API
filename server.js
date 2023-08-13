const mongoose = require('mongoose')
const dotenv = require('dotenv');

process.on('uncaughtException',err=>{
  console.log('we encounterd an uncought exception! we are shutting down...')
  console.log(err.name,err.message)
  process.exit(1)
})
dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(process.env.NODE_ENV);

const DB = process.env.DATABASE
mongoose.connect(DB).then(()=>{
console.log('db connected sucessfully')
  });
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app is listening to the port ${port}...`);
})
//handling Unhandled promises rejections
process.on('unhandledRejection', err=>{
  console.log(err.name,err.message)
  console.log('we encountered an unhandled rejection! the server is shutting down...')
  //first close the server then exit the app
server.close(()=>{
  process.exit(1)
})
})