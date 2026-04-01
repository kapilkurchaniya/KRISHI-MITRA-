const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const authmiddleware = require('../middleware/auth.middleware');


router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/get-me', authmiddleware.authuser , controller.getMe);
router.get('/logout', controller.logout);



module.exports = router;
