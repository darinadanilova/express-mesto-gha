const { PORT = 3000 } = process.env;
const { MONGODB = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const { SECRET_KEY = 'some-secret-key' } = process.env;

module.exports = {
  PORT,
  MONGODB,
  SECRET_KEY,
};
