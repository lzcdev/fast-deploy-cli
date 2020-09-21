const inquirer = require('inquirer')

const selectProjectName = 'PROJECT_NAME'
const options = [
  {
    type: 'list',
    name: selectProjectName,
    message: 'Which project do you want to deploy?',
    choices: []
  }
]

function helper (config) {
  return new Promise((resolve, reject) => {
    initHelper(config)
    inquirer.prompt(options).then(answers => {
      resolve({ config: findInfoByName(config, answers[selectProjectName]) })
    }).catch(err => {
      reject(console.err('helper 显示或选择出错', err))
    })
  })
}

function initHelper (config) {
  for (let item of config) {
    options[0].choices.push(item.name)
  }
  console.log('正在检查全局配置信息....')
  if (new Set(options[0].choices).size !== options[0].choices.length) {
    console.error('请检查配置信息，存在相同name');
    process.exit(1)
  }
}

function findInfoByName (config, name) {
  for (let item of config) {
    if (item.name === name) {
      return item
    }
  }
}

module.exports = helper