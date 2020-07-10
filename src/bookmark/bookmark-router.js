const express = require('express');
const { v4: uuid } = require('uuid');
const logger = require('../logger');
const { bookmarks } = require('../store');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
  .route('/bookmark')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, website, description, rating } = req.body;

    if(!website) {
      logger.error('Website is required');
      res
        .status(400)
        .send('Invalid data');
    }
    if(!description) {
      logger.error('Description is required');
      res
        .status(400)
        .send('Invalid data');
    }
    const id = uuid();

    const bookmark = {
      id,
      title,
      website,
      description,
      rating
    };

    bookmarks.push(bookmark);

    logger.info('Bookmark has been created');

    res
      .status(200)
      .location(`http://localhost:8000/card/${id}`)
      .json(bookmark);
            
      
    
  });

bookmarkRouter
  .route('/bookmark/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id == id);

    if(!bookmark) {
      logger.error(`Bookmark with id ${id} was not found`);
      res
        .status(404)
        .send('Bookmark not found');
    }
    res
      .json(bookmark);
    
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(b => b.id == id);

    if(bookmarkIndex == -1) {
      logger.error(`Bookmark with id ${id} was not found`);
      res
        .status(404)
        .send('Bookmark not found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info('Bookmark was deleted');

    res
      .status(204)
      .end();


  });

module.exports = bookmarkRouter;