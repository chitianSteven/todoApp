var mongoose = require('mongoose'); 

var NoteSchema = new mongoose.Schema({
    title: String,
    priority: String,
    content: String,
    complete: Boolean,
    alarm: Boolean,
    date: {type:Date, default: Date.now},
});

module.exports = mongoose.model('Note', NoteSchema);
