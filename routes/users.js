const router = require('express').Router();
const {
  getUsers, getUserById, createUser, patchUser, patchAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:id', getUserById);

router.post('/', createUser);

router.patch('/', patchUser);

router.patch('/', patchAvatar);

module.exports = router;
