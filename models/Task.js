const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    created: {
        type: Date,
        default: Date.now()
    },
    state: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Task', TaskSchema);