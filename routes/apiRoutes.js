const router = require('express').Router();
const authenticationRoutes = require('../controllers/authenticationRoutes');

router.get("/", authenticationRoutes.authGoogle);

module.exports = router; 