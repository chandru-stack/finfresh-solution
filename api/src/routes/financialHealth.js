const express = require('express');
const auth = require('../middleware/auth');
const { getFinancialHealth } = require('../controllers/financialHealthController');

const router = express.Router();
router.get('/', auth, getFinancialHealth);
module.exports = router;