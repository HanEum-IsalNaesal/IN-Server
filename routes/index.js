const router = require('express').Router();
const userRoutes = require('./userRoutes');
const apiRoutes = require('./apiRoutes');





router.use("/api", apiRoutes);
router.use("/users", userRoutes);

module.exports = router;
