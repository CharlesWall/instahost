
#
# GET home page.
#
path = require 'path'
fs = require 'fs'

getFileLinks = (dirPath, callback)->
  fs.readdir dirPath, (err, files)->
    if err then return callback err


    callback null, files.map (name)-> 
      href = name
      return {href, name}

module.exports = ({hostPath})->
  (req, res, next)->
    dir = path.join hostPath, req.path
    console.log "showing index of #{dir}" 
    fs.stat dir, (err, stats)->
      if err then next err
      else if stats.isDirectory()
        getFileLinks dir, (err, links)->
          res.render 'index',
            title: "Instahost /#{hostPath}"
            links: links
      else next()