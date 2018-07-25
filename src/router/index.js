const express = require('express');

const router = express.Router();

const userRoutes = require('../modules/User/routes');
const { sendJSONResponse } = require('../helpers');

router.get('/', (req, res) => {
  sendJSONResponse(res, 200, null, req.method, 'Connected!');
});

router.use('/user', userRoutes);


module.exports = router;
