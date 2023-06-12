const router = require('express').Router();
const {
  createUser, getUsers, getUserById, patchUser, patchAvatar,
} = require('../controllers/users');

router.post('/', createUser);

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.patch('/me', patchUser);

router.patch('/me/avatar', patchAvatar);

module.exports = router;
