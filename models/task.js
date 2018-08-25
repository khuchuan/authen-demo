var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    CreateTime: Date,
    Status: boolean    
})

// Add task



var Task = mongoose.model("Task", TaskSchema) ;
module.exports = Task;