const router = require('express').Router();
const userRoutes = require('./userRoutes');
const apiRoutes = require('./apiRoutes');
const oauthRoutes = require('./oauthRoutes');
const loginRoutes = require('./loginRoutes')
const registerRoutes = require('./registerRoutes');

//routes for login
router.use("/login", loginRoutes);
//routes for register
router.use("/registerform", registerRoutes);
//routes for api
router.use("/api", apiRoutes);
//routes for userinfos
router.use("/users", userRoutes);
// routes for oauth
router.use("/oauth", oauthRoutes);

router.get("/", (req, res) => {
    res.send(`
        <h1>Log in</h1>
        <a href="/oauth/test">Log in</a>
    `);
})
module.exports = router;
