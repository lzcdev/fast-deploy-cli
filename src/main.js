const archiverFile = require('./libs/archiver') // 压缩
const ssh_connect = require('./libs/ssh') // 连接服务器
const upload = require('./libs/upload') // 上传zip至服务器
const unzip = require('./libs/unzip') // 解压服务器的zip文件并删除dist.zip

const config = require('../deploy.config')
const helper = require('./utils/helper')

/**
 * 1、压缩dist.zip
 * 2、连接服务器
 * 3、上传dist.zip
 * 4、服务器解压并删除dist.zip
 * 5、本地删除dist.zip
 */
async function main () {
  try {
    const selectedConfig = (await helper(config)).config
    await archiverFile(selectedConfig)
    await ssh_connect(selectedConfig)
    await upload(selectedConfig)
    await unzip(selectedConfig)
  } catch (error) {
    console.log('发布失败，请重试...')
  } finally {
    process.exit()
  }
}

main()