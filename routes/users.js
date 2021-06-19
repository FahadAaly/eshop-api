const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
// const auth = require('../middleware/auth');

router.get('/', UserController.GetUserList);
router.get('/:id', UserController.GetUserById);
router.post('/', UserController.PostUser);
router.delete('/:id', UserController.DeleteUser);
router.get('/count', UserController.GetUserCount);
router.post('/login', UserController.Login);

module.exports = router;
