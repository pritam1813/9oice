const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    return res.send("<h1>V2</h1>");
});

router.use('/posts', require('./posts'));

module.exports = router;