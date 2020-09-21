const fs = require('fs')
const archiver = require('archiver')

function archiverFile (config) {
  console.log('1、开始压缩文件...')
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 }
    }).on('error', err => {
      throw err
    })
    const output = fs.createWriteStream(`${process.cwd()}/${config.distPath}.zip`).on('close', err => {
      if (err) {
        reject(err)
        console.log('文件压缩异常', err);
        return
      }
      resolve()
      console.log(`文件压缩完成，共计 ${archive.pointer()} bytes`);
    })
    archive.pipe(output)
    archive.directory(`${process.cwd()}/${config.distPath}`, '/')
    archive.finalize()
  })
}

module.exports = archiverFile
