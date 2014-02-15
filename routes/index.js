
/*
 * GET home page.
 */
path = require('path');
fs = require('fs');

var getFileLinks = function(){
  var ret = [];

  var files = fs.readdirSync('public');

  files.forEach(function(filename){
    ret.push({ "name": "/" + filename, "href": "/" + filename});
  });

  return ret;
};

exports.index = function(req, res){
  var map = getFileLinks();

  res.render('index', {
    title: 'Instahost',
    map: map
  });
};