const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

//Routes
router.get('/', userController.view);
router.get('/register', userController.register);
router.post('/response', userController.response);
module.exports = router;