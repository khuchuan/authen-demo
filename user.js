var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
        //unique: true
    },
    password: {
        type: String,
        required: true       
    }
})

// authenication 
userSchema.statics.authenticate = function (email, password, callback){
    User.findOne( {email: email})
    .exec(function(err, user){
        if (err)
            return callback(err);
        else if (!user){
            var err = new Error('Customer not found');
            err.status = 401;
            return callback(err);
        }

        bcrypt.compare(password, user.password, function(err, result){
            if (result === true)
                return callback(null, user);
            else{
                console.log('Sai pass: ' + password);
                return callback();
            }
        })
        
        

        // bcrypt.hash(password, 10, function (err, hash) {
        //     if (err) {
        //       return callback(err);
        //     }

        //     console.log('hash: ' + hash )
        //     console.log('password: ' + user.password);

        //     bcrypt.compare(hash, user.password, function(err, result){
        //         if (result === true)     
        //             return callback(null, user);
        //         else    
        //             return callback();
        //     })
        // });       
    });
};

var User = mongoose.model("User", userSchema);
module.exports = User;