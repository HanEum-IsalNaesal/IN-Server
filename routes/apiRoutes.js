const router = require('express').Router();

router.get("/", (req, res) => {
    console.log("api");
    res.send('api');
});

module.exports = router; 