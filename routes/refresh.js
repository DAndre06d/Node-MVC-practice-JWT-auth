const express = require('express');
const router = express.Router();
const path = require('path');
const refreshTokencontroller = require('../controllers/refreshTokenController')


router.get('/', refreshTokencontroller.handleRefreshToken)
module.exports = router;
