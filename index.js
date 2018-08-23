var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var user = require('./user');

// Connect to db, save user
mongoose.connect('mongodb://localhost/todoapps', function(err){
    if (err) throw err;
    // Connect ok, collect data and save db
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/register', function(req, res, next){        
    var obj = req.body;
    console.log(obj);
    
    const bcrypt = require('bcrypt');  

    var hask = bcrypt.hash(obj.password, 10)    
    .then(function(hashedPassword) {
        var userInfo = new user({
            email: obj.email,
            username: obj.username,
            password: hashedPassword
        });    

        userInfo.save(function(err){
            if (err) throw err;
            
            console.log('Register user successfull');

            // res.setHeader("Content-Type", "text/html");
            // res.write("<p>Hello World</p>");
            // res.end();  

            res.send("<p>Register success</p>");            
        })        
    })
    .then(function() {
        console.log('da vao then');               
    })
    .catch(function(error){
        console.log("Error saving user: " + JSON.stringify(error));                        
    });   
});

app.use(express.static(__dirname + '/templateLogReg'));
app.get('/', function(req, res){
    res.sendFile (path.join(__dirname + '/templateLogReg/index.html'));
})

app.get('/alert', function(req, res){
    res.end("Register ok");
})

app.listen(3000, function(){
    console.log("Listen on port 3000");
})