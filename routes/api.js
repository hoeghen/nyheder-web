var express = require('express');
var feedly = require('../public/javascripts/feedly')
var router = express.Router();

/* GET users listing. */
router.get('/test', function(req, res, next) {
  res.send('this is a test');
});

router.get('/news', function(req, res, next) {
  feedly.getAllNews(function(list){
    res.send(list)
  })
});


module.exports = router;
