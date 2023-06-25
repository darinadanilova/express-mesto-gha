/* eslint-disable func-names */
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    validate: {
      validator: ({ length }) => length >= 2 && length <= 30,
      message: 'Имя пользователя должно быть длиной от 2 до 30 символов',
    },
  },
  about: {
    type: String,
    default: 'Исследователь',
    validate: {
      validator: ({ length }) => length >= 2 && length <= 30,
      message: 'Информация о пользователе должна быть длиной от 2 до 30 символов',
    },
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url) {
        return /https?:\/\/(?:www\.)?\w+\.\w+(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?(?:#\w*)?/.test(url);
      },
      message: 'Введите URL картинки',
    },
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле "email" должно быть заполнено'],
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Введите email адрес',
    },
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Поле "password" должно быть заполнено'],
  },
}, { versionKey: false });

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;

  return user;
};

module.exports = mongoose.model('user', userSchema);
