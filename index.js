// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


// App setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({type: '*/*'}));
router(app);


// database connection, URL in a .env file. This contains the name and password for the database in mongodb.
//const url = `mongodb+srv://<name>:<password>@cluster0.iirbj.mongodb.net/Agri?retryWrites=true&w=majority`;

// db
mongoose
  .connect(
    //url, {
    process.env.URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected"));

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port, ()=>{
    console.log('server listening on port', port);
});