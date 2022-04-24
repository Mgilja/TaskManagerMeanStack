const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    _userId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    
});

const List = mongoose.model( 'list', listSchema  );

module.exports = { List };
