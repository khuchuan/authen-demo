var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');


// Connect to db, save user
mongoose.connect('mongodb://localhost/todoapps', function(err){
    if (err) throw err;
    // Connect ok, collect data and save db
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false}));

app.use(express.static(__dirname + '/templateLogReg'));

var routes = require('./routes/router');
app.use('/', routes);


app.listen(3000, function(){
    console.log("Listen on port 3000");
})