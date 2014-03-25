
/*
 * GET home page.
 */
path = require('path');
fs = require('fs');


var hostPath = path.join(process.cwd(), 'public');
if(!path.existsSync(hostPath)) hostPath = process.cwd();

var getFileLinks = function(subPath, callback){
  var links = [];
  var dir = path.join(hostPath, subPath);
  console.log(dir);
  fs.readdir(dir, function(err, files){
    files.forEach(function(filename){
      links.push({ "name": "/" + filename, "href": path.join(subPath, filename) });
    });
    callback(links);
  });
};

//exports.index = function(req, res){
//  var map = getFileLinks();
//
//  res.render('index', {
//    title: 'Instahost',
//    map: map
//  });
//};

exports.dir = function(req, res, next){
  var filePath = path.join(hostPath, req._parsedUrl.pathname);

  fs.stat(filePath, function(err, stats){
    if(stats && stats.isDirectory()){
      getFileLinks(req._parsedUrl.pathname, function(links){
        res.render('index', {
          title: 'Instahost',
          map: links
        });
      });
    } else next();
  });
};