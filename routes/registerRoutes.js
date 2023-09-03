const router = require('express').Router();
const authenticationRoutes = require('../controllers/authenticationRoutes');


router.post('/', authenticationRoutes.register);

module.exports = router; 