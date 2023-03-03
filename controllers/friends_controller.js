const Friends = require('../models/friendships');
const User = require('../models/user');

module.exports.addFriend = async function (req, res) {
    try {
        //Finding users with their id. Both friend request sender and reciever are required.
        const fromUser = await User.findById(req.user.id);
        const toUser = await User.findById(req.params.id);

        //If any of the user doesn't exists
        if (!fromUser || !toUser) {
            return res.status(404).send('User not found');
        }

        //Searching the Friend's DB to check if the friendship between the users exists
        const friendExist = await Friends.findOne({
            $or: [
                { from_user: fromUser._id, to_user: toUser._id },
                { from_user: toUser._id, to_user: fromUser._id }
            ]
        });

        //If they are already friend
        if (friendExist) {
            console.log("Friend Already Exists");
            req.flash('error', 'Friend Already Exists');

        } else {
            //If not, then create a DB with adding them as friends
            let friend = await Friends.create({
                from_user: req.user.id,
                to_user: req.params.id
            });

            //Updating Users DB Friends field
            fromUser.friends.push(friend);
            await fromUser.save();

            toUser.friends.push(friend);
            await toUser.save();

            req.flash('success', 'Friend Added');
        }

        return res.redirect('back');
    } catch (error) {
        console.log(error);
    }
}

module.exports.removeFriend = async function (req, res) {
    try {

        //Searching the Friend's DB to check if the friendship between the users
        const friendship = await Friends.findById(req.params.id);
        let fromUser = friendship.from_user._id;
        let toUser = friendship.to_user._id;

        await friendship.remove();

        await User.findByIdAndUpdate(fromUser, { $pull: { friends: req.params.id } });
        await User.findByIdAndUpdate(toUser, { $pull: { friends: req.params.id } });
        req.flash('success', 'Friend removed');
        return res.redirect('back');
    } catch (error) {
        console.log(error);
    }
}