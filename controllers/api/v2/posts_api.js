module.exports.index = (req, res) => {
    return res.status(200).json({
        message: "Posts List v2",
        data: {
            posts: [],
            Comments: []
        }
    });
}