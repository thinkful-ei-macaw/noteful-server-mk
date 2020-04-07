require('dotenv').config();
const { NODE_ENV, DATABASE_URL, TEST_DATABASE_URL, SSL } = require('./src/config');

module.exports = {
  'migrationDirectory': 'migrations',
  'driver': 'pg',
  'connectionString': NODE_ENV === 'test'
    ? TEST_DATABASE_URL
    : DATABASE_URL,
  'ssl': !!SSL
};