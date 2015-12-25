var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var contact = require('../models/ContactList.js');

/* GET /todos listing. */
router.get('/', function(req, res, next) {
  contact.find(function (err, contacts) {
  	console.log("searching...");
    if (err) return next(err);
    res.json(contacts);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  contact.create(req.body, function (err, post) {
  	console.log(req.body);
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  contact.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  contact.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  contact.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
