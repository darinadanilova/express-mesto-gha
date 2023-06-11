const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6485bc79c1bcd444ef0804e6',
  };

  next();
});

app.use(router);

app.listen(3001, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3001');
});
