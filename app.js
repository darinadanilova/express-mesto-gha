const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const {
  PORT,
  MONGODB,
} = require('./utils/config');

const app = express();

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '648618ea2812f35f9445ff30',
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
