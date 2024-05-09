// module imports
const express = require('express');

// file imports
const { getAllLogs, addLog } = require('../controllers/log');

// variable initializations
const router = express.Router();

router.route('/').get(getAllLogs).post(addLog);

module.exports = router;