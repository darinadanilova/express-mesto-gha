const router = require('express').Router();
const userRoutes = require('./users');
const auth = require('../middlwares/auth');
const cardRoutes = require('./cards');
const {
  ERROR_NOT_FOUND,
} = require('../utils/errors');
const { createUser } = require('../controllers/users');
const { login } = require('../controllers/users');

router.post('/signup', createUser);
router.post('/signin', login);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('*', (req, res, next) => next(new ERROR_NOT_FOUND('Запрашиваемый ресурс не найден')));

module.exports = router;
