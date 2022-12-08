var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express sss' });
});

router.get('/json', function(req, res) {
  res.json({
    message: 'Hi nama saya Rindu',
    app_name:process.env.APP_NAME
  });
});

module.exports = router;
