const express = require('express');
const xss = require('xss');
const uuid = require('uuid');

const notesRouter = express.Router();
const NotesService = require('../services/app-service')('notes');

// middleware setup
notesRouter.use(express.json());


// sanitizing note data before it goes out
const sanitizeNote = note => {
  return {
    id: note.id,
    name: xss(note.name),
    content: xss(note.content),
    folder_id: note.folder_id,
    modified: note.modified
  };
};


// create record
notesRouter.post('/', (req, res, next) => {
  const db = req.app.get('db');

  const requiredFields = ['name', 'content', 'folder_id'];
  for (let field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .send(`'${field}' is required`);
    }
  }

  const id = uuid.v4();
  const { name, content, folder_id, modified } = req.body;
  const note = { id, name, content, folder_id };
  if (modified) note.modified = modified;

  NotesService.addItem(db, note)
    .then(note => {
      return res.status(201).json(sanitizeNote(note));
    })
    .catch(next);
});


// read records
notesRouter.get('/', (req, res, next) => {
  const db = req.app.get('db');

  NotesService.getItems(db)
    .then(notes => {
      return res.status(200).json(notes.map(sanitizeNote));
    })
    .catch(next);
});

notesRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const db = req.app.get('db');

  NotesService.getItemById(db, id)
    .then(note => {
      if (note) {
        return res.status(200).json(sanitizeNote(note));
      } else {
        return res.status(404).send('Note not found');
      }
      
    })
    .catch(next);
});


// delete record
notesRouter.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const db = req.app.get('db');

  NotesService.getItemById(db, id)
    .then(note => {
      if (!note) {
        return res.status(404).send('Note not found');
      }

      NotesService.deleteItem(db, id)
        .then(() => {
          return res.status(204).end();
        })
        .catch(next);
    });

});


module.exports = notesRouter;