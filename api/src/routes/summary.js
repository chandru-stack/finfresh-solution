const express = require('express');
const auth = require('../middleware/auth');
const { getSummary } = require('../controllers/summaryController');

const router = express.Router();
router.get('/', auth, getSummary);
module.exports = router;