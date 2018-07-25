const express = require('express');

const router = express.Router();

const userRoutes = require('../modules/User/routes');

router.use('/user', userRoutes);


module.exports = router;
