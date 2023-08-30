const router = require('express').Router();

router.get("/", (req, res) => {
    res.send(`
        <h1>Log in</h1>
        <a href="/oauth/test">Log in</a>
    `);
});

module.exports = router; 