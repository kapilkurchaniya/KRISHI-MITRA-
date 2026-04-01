const express = require('express');
const router = express.Router();
const {registercontroller, logincontroller , getMeController} = require('../controllers/auth.controller');
const userverify = require('../middleware/auth.middleware');



router.post('/register', registercontroller);
router.post('/login', logincontroller);
router.get('/get-me', userverify, getMeController);

module.exports = router;