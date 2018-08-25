var mongoose = require('mongoose');

var TaskSchema = mongoose.Schema({
    Userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    Task: {
        type: String,
        required: true
    },
    CreateTime: Date,
    Status: Boolean    
})

// Add task

var Task = mongoose.model("Task", TaskSchema) ;
module.exports = Task;