const mongoose = require('mongoose');

const mesageSchema =  mongoose.Schema;

const messages = new mesageSchema({
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Message = mongoose.model('Message', messages);

module.exports = Message;