const mongoose = require('mongoose');
const User = require('./user');         //user model

const friendsSchema = new mongoose.Schema({
    // the user who sent this request
    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // the user who accepted this request, the naming is just to understand, otherwise, the users won't see a difference
    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

const Friends = mongoose.model('Friends', friendsSchema);

module.exports = Friends;