const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgetPassword,sendPin } = require('../controllers/User_controller');

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login
router.post('/login', loginUser);


router.post("/sendpin",sendPin)

router.post('/forget-password', forgetPassword);

module.exports = router;
