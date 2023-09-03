const router = require('express').Router();
const authenticationRoutes = require('../controllers/authenticationRoutes');

router.post('/', authenticationRoutes.auth);

router.get("/google", authenticationRoutes.authGoogle);

module.exports = router; 