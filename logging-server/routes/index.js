// module imports
const express = require('express');

// file imports
const log = require('./log');

// variable initializations
const router = express.Router();

router.use('/logs', log);

module.exports = router;