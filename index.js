var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var user = require('./user');

// Connect to db, save user
mongoose.connect('mongodb://localhost/todoapps', function(err){
    if (err) throw err;
    console.log('Connect db ok');

    // Connect ok, collect data and save db
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.post('/register', function(req, res, next){
    if ( req.body.username || req.body.email || req.body.password || req.body.passwordConf)    {
        console.log('Vui long nhap du tham so');
        next();
    }

    // Check pass and passConf
    if (req.body.password != req.body.passwordConf)    {        
        console.log('Password khong khop');
        res.send('Password confirm khong khop');
        return;
    }
    
    const bcrypt = require('bcrypt');
    var hask = bcrypt.hash(req.body.password, 10)    
    .then(function(hashedPassword) {
        var userInfo = new user({
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword
        });    
        userInfo.save(function(err){
            if (err) throw err;
            console.log('Register user successfulee');
        })        
    })
    .then(function() {
        res.send('OK');
    })
    .catch(function(error){
        console.log("Error saving user: ");
        console.log(error);
        next();
    });
   
});

app.use(express.static(__dirname + '/templateLogReg'));
app.get('/', function(req, res){
    res.sendFile (path.join(__dirname + '/templateLogReg/index.html'));
})

app.listen(3000, function(){
    console.log("Listen on port 3000");
})