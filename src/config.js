const { PORT, NODE_ENV, DATABASE_URL, TEST_DATABASE_URL, SSL } = process.env;

module.exports = {
  PORT: PORT || 8000,
  NODE_ENV,
  DATABASE_URL,
  TEST_DATABASE_URL,
  SSL
};