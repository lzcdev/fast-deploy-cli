const ssh = require('../utils/ssh_helper')

function upload (config) {
  return new Promise((resolve, reject) => {
    ssh.putFile(`${process.cwd()}/${config.distPath}.zip`, `${config.webDir}/dist.zip`).then(() => {
      console.log('3、zip包上传成功')
      resolve()
    }).catch(err => {
      console.log('3、zip包上传失败')
      reject()
      process.exit(1)
    })
  })

}

module.exports = upload