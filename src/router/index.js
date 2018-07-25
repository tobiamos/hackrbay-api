const express = require('express');

const router = express.Router();

const userRoutes = require('../modules/User/routes');
const patchRoutes = require('../modules/Patch/routes');
const imageRoutes = require('../modules/Images/routes');
const { sendJSONResponse } = require('../helpers');

router.get('/', (req, res) => {
  sendJSONResponse(res, 200, null, req.method, 'Connected!');
});

router.use('/user', userRoutes);
router.use('/patch', patchRoutes);
router.use('/image', imageRoutes);

module.exports = router;
