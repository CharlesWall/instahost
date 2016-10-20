
#
# GET home page.
#
Promise = require 'bluebird'
path = require 'path'
fs = Promise.promisifyAll require 'fs'




module.exports = ({hostPath})->
  getFileStream = (localPath)-> fs.createReadStream(localPath)

  getFileLinks = (localPath, remotePath)->
    fs.readdirAsync localPath
      .then (files)->
        files.map (name)->
          href = path.join remotePath, name
          return {href, name}

  showIndex = (localPath, remotePath, res)->
    console.log "showing index of #{localPath}"
    getFileLinks localPath, remotePath
      .then (links)->
        res.render 'index',
          title: "Instahost /#{hostPath}"
          links: links

  console.log({hostPath})
  (req, res, next)->
    localPath = path.join hostPath, req.path
    fs.statAsync localPath
      .then (stats)->
        if stats.isDirectory()
          showIndex(localPath, req.path, res)
        else
          getFileStream(localPath).pipe res
