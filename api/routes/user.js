const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.post('/auth/register', UserController.create);
router.post('/auth/login', UserController.add);





module.exports = router;