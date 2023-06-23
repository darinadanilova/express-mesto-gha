/* eslint-disable import/no-extraneous-dependencies */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./users');
const auth = require('../middlwares/auth');
const cardRoutes = require('./cards');
const {
  ERROR_NOT_FOUND,
} = require('../utils/errors');
const { createUser } = require('../controllers/users');
const { login } = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi
      .string()
      .pattern(/https?:\/\/(?:www\.)?\w+\.\w+(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?(?:#\w*)?/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('*', (req, res, next) => next(new ERROR_NOT_FOUND('Запрашиваемый ресурс не найден')));

module.exports = router;
