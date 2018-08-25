var express = require('express');
var router = express.Router();
var user = require('../user');

var session = require("express-session");
router.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

router.get('/set', function(req, res){   
    console.log('session id Set: ' + req.session.id );
    sess = req.session;
    sess.username = 'khuchuan'    
    res.end("Set session ok");
})

router.get('/get', function(req, res){
    console.log('session id get: ' + req.session.id );
    sess = req.session;
    if (sess.username)
        res.end("Exits session. Username: " + sess.username);
    else
        res.end("KHong ton tai session: " + sess.username);
});

router.get('/', function(req, res){
    res.sendFile (path.join(__dirname + '/templateLogReg/index.html'));
})

router.get('/alert', function(req, res){
    res.end("Register ok");
})

router.post('/', function(req, res, next){
    console.log('logpassword: ' + req.body.logpassword);

    user.authenticate(req.body.logemail, req.body.logpassword, function(err, user){
        if(err || !user)         {
            var error = new Error('Wrong email or password');
            error.status = 401;
            return next(error);
        }
        else{
            req.session.userId = user._id;
            return res.redirect('/profile');
        }
    })
});

router.get('/profile', function(req, res, next){
    res.end('Xin chao: ' + req.session.userId 
        + '<br/>Chuc ban mot ngay vui ve');
});

router.post('/register', function(req, res, next){        
    var obj = req.body;    
    const bcrypt = require('bcrypt');  

    var hask = bcrypt.hash(obj.password, 22)    
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

module.exports = router;