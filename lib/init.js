const fs = require('fs')
const path = require('path')
const download = require('download-git-repo');
const ora = require('ora');
const spinner = ora('下载配置模板中...')
const tmp = 'deploy'
const templateUrl = 'lzcdev/fast-deploy-cli-template';
const deployPath = path.join(process.cwd(), './deploy');
const deployConfigPath = `${deployPath}/deploy.config.js`;

const downloadTemplate = url => {
  spinner.start();

  download(url, tmp, { clone: false }, err => {
    if (err) {
      console.log('模板下载失败', err)
      process.exit(1)
    }
    spinner.stop()
    console.log('模板下载成功，请先配置模板，模板位置：deploy/deploy.config.js')
    process.exit(0);
  })
}

const init = () => {
  if (fs.existsSync(deployPath) && fs.existsSync(deployConfigPath)) {
    console.log('deploy目录下的deploy.config.js配置文件已经存在，请勿重复下载');
    return
  }
  downloadTemplate(templateUrl)
}

module.exports = init