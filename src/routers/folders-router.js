const express = require('express');
const xss = require('xss');
const uuid = require('uuid');

const foldersRouter = express.Router();
const FoldersService = require('../services/app-service')('folders');

// middleware setup
foldersRouter.use(express.json());


// sanitizing folder data before it goes out
const sanitizeFolder = folder => {
  return {
    id: folder.id,
    name: xss(folder.name)
  };
};

// create record
foldersRouter.post('/', (req, res, next) => {
  const db = req.app.get('db');

  const requiredFields = ['name'];
  for (let field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .send(`'${field}' is required`);
    }
  }

  const id = uuid.v4();
  const { name } = req.body;
  const folder = { id, name };

  FoldersService.addItem(db, folder)
    .then(f => {
      return res.status(201).json(sanitizeFolder(f));
    })
    .catch(next);
});


// read records
foldersRouter.get('/', (req, res, next) => {
  const db = req.app.get('db');

  FoldersService.getItems(db)
    .then(folders => {
      return res.status(200).json(folders.map(sanitizeFolder));
    })
    .catch(next);
});

foldersRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const db = req.app.get('db');

  FoldersService.getItemById(db, id)
    .then(folder => {
      if (folder) {
        return res.status(200).json(sanitizeFolder(folder));
      } else {
        return res.status(404).send('Folder not found');
      }
      
    })
    .catch(next);
});


// delete record
foldersRouter.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const db = req.app.get('db');

  FoldersService.getItemById(db, id)
    .then(note => {
      if (!note) {
        return res.status(404).send('Folder not found');
      }

      FoldersService.deleteItem(db, id)
        .then(() => {
          return res.status(204).end();
        })
        .catch(next);
    });
    
});


module.exports = foldersRouter;