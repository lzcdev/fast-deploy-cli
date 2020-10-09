
const path = require('path');
const fs = require('fs');
const ora = require('ora');
const archiver = require('archiver');
const { NodeSSH } = require('node-ssh')
const ssh = new NodeSSH()

async function deploy (config) {
  try {
    await archiverFile(config)
    await ssh_connect(config)
    await upload(config)
    await unzip(config)
  } catch (error) {
    console.log('部署失败，请重试...')
  } finally {
    process.exit()
  }
}

function archiverFile (config) {
  console.log('（1）开始压缩文件...')
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

function ssh_connect (config) {
  return new Promise((resolve, reject) => {
    const { sshConfig } = config
    ssh.connect({ ...sshConfig }).then(() => {
      console.log(`（2）服务器 ${sshConfig.host} 连接成功`)
      resolve()
    }).catch(err => {
      console.log(`（2）服务器 ${sshConfig.host} 连接失败`, err)
      reject()
    })
  })
}

function upload (config) {
  return new Promise((resolve, reject) => {
    ssh.putFile(`${process.cwd()}/${config.distPath}.zip`, `${config.webDir}/dist.zip`).then(() => {
      console.log('（3）zip包上传成功')
      resolve()
    }).catch(err => {
      console.log('（3）zip包上传失败')
      reject()
      process.exit(1)
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
      console.log('（4）解压成功并删除服务器dist.zip文件')
      deleteLocalZip(config)
    }).catch(err => {
      console.log('（4）文件解压失败')
      reject(err)
    })
  })
}

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
        console.log('\n（5）本地dist.zip删除失败', err)
      }
      console.log('（5）本地dist.zip删除成功');
      console.log('恭喜您部署成功!')
      resolve()
      process.exit(0)
    })
  })
}

module.exports = deploy