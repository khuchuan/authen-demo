var express = require('express');
var router = express.Router();
var user = require('../user');
var task = require('../task');

var session = require("express-session");
router.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
})

router.post('/', function (req, res, next) {
    user.authenticate(req.body.logemail, req.body.logpassword, function (err, user) {
        if (err || !user) {
            var error = new Error('Wrong email or password');
            error.status = 401;
            return next(error);
        }
        else {
            req.session.userId = user._id;
            req.session.email = user.email;

            return res.redirect('/task');
        }
    })
});

router.get('/task', function (req, res, next) {
    if (!req.session.userId)
    {
        console.log("Ban phai dang nhap");
        res.redirect('/');
        return;
    }

    // Lay danh sach theo userid tu DB va truyen vao
    task.find({ Userid: req.session.userId })
        .then(data => {
            res.render("task", { task: data });
        })
        .catch(err => {
            console.log('Co loi trong khi load /taks: ' + JSON.stringify(err));
        })
});

// Them task moi va show
router.post('/addtask', function (req, res, next) {
    if (!req.session.userId)
    {
        console.log("Ban phai dang nhap");        
        res.redirect('http://localhost:3000/');
        return;
    }


    var newTask = req.body.newtask;

    var Task = new task({
        Userid: req.session.userId,
        Task: newTask,
        CreateTime: Date.now(),
        Status: false
    });

    // Luu vao db
    Task.save(function (err) {
        if (err) {
            // console.log('Loi luu task vao db: ' + JSON.stringify(err) );
            throw err;
        }

        // Da luu vao db ok, reload va show
        res.redirect("/task");
    })
})

// Remove task
router.get('/removetask/:id', function (req, res) {
    if (!req.session.userId)
    {
        console.log("Ban phai dang nhap");
        res.redirect('http://localhost:3000/');
        return;
    }
    

    var taskid = req.params.id;
    console.log('taskid: ' + taskid);

    task.findOneAndRemove({ _id: taskid })
        .then(response => {
            console.log('Xoa ok: ' + JSON.stringify(response));
            res.redirect("/task");;
        })
        .catch(err => {
            console.error(err)
        })
})

router.post('/register', function (req, res, next) {
    var obj = req.body;
    const bcrypt = require('bcrypt');

    var hask = bcrypt.hash(obj.password, 10)
        .then(function (hashedPassword) {
            var userInfo = new user({
                email: obj.email,
                username: obj.username,
                password: hashedPassword
            });

            userInfo.save(function (err) {
                if (err) {
                    console.log("Loi save: " + JSON.stringify(err));
                    throw err;
                }

                //  console.log('Register user successfull');
                res.send("<p>Register success</p>");
            })
        })
        .then(function () {
            // console.log('da vao then');               
        })
        .catch(function (error) {
            //  console.log("Error saving user: " + JSON.stringify(error));                        
        });
});

module.exports = router;