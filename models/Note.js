/*Asset other message*/
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var NoteScheMa = new Schema({
    "hostId": {
        type: Schema.Types.ObjectId,
        index: true
    },
    "noteName": {
        type: String
    },
    "noteValue": {
        type: String
    }
});


module.exports = mongoose.model('Note', NoteScheMa, 'Note');
