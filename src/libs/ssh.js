const fs = require('fs')
const path = require('path')
const ssh = require('../utils/ssh_helper')

function ssh_connect (config) {
  return new Promise((resolve, reject) => {
    const { sshConfig } = config
    ssh.connect({ ...sshConfig }).then(() => {
      console.log(`2、服务器 ${sshConfig.host} 连接成功`)
      resolve()
    }).catch(err => {
      console.log(`2、服务器 ${sshConfig.host} 连接失败`, err)
      reject()
    })
  })
}

module.exports = ssh_connect