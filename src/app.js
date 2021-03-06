/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { NODE_ENV } = require('./config');
const foldersRouter = require('./routers/folders-router');
const notesRouter = require('./routers/notes-router');

const app = express();
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';


// set up middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// endpoint setup
const endpoints = {
  '/folders': foldersRouter,
  '/notes': notesRouter
};

Object.keys(endpoints).forEach(route => {
  app.use(route, endpoints[route]);
});

// request handling
app.get('/', (req, res) => {
  res.status(200).json({
    endpoints: Object.keys(endpoints)
  });
});

// error handling
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  let response;
  if (NODE_ENV === 'production') {
    console.error(error.message);
    response = { error: { message: 'Server error' } };
  } else {
    response = { message: error.message, error };
  }

  res.status(500).json(response);
};

app.use(errorHandler);


// the bottom line, literally
module.exports = app;