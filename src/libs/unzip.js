const fs = require('fs')
const { resolve } = require('path')
const ssh = require('../utils/ssh_helper')

function runCommand (commond, webDir) {
  return new Promise((resolve, reject) => {
    ssh.execCommand(commond, { cwd: webDir }).then(result => {
      resolve()
      if (result.stderr) {
        console.log(result.stderr)
        process.exit(1)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

function deleteLocalZip (config) {
  return new Promise((resolve, reject) => {
    fs.unlink(`${process.cwd()}/${config.distPath}.zip`, err => {
      if (err) {
        reject()
        console.log('5、本地dist.zip删除失败', err)
      }
      console.log('5、本地dist.zip删除成功');
      resolve()
      process.exit(0)
    })
  })

}

function unzip (config) {
  return new Promise((resolve, reject) => {
    const commands = [`cd ${config.webDir}`, 'pwd', 'unzip -o dist.zip && rm -f dist.zip']
    const promises = []
    for (let i = 0; i < commands.length; i++) {
      promises.push(runCommand(commands[i], config.webDir))
    }
    Promise.all(promises).then(() => {
      console.log('4、解压成功并删除服务器dist.zip文件')
      deleteLocalZip(config)
    }).catch(err => {
      console.log('4、文件解压失败')
      reject(err)
    })
  })
}

module.exports = unzip