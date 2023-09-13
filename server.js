'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
require('dotenv').config();


const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');
const apiRoutes         = require('./routes/api.js');

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//DATABASE CONNECTIION

const mongoose=require('mongoose');
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true});
const db=mongoose.connection;
 db.on('connected', async () => {
  console.log('Mongoose connected to database');
  
  
  
});
db.on('error',(err) => {
  console.log('Error in connecting to database.');
});
db.on('disconnected',() => {
  console.log('Mongoose disconnected');
});



apiRoutes(app);



//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });



//For FCC testing purposes
fccTestingRoutes(app);

 
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
