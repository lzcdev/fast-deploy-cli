const fs = require('fs')

function checkDeployConfig (deployConfigPath) {
  const config = require(deployConfigPath)
  let configs = []
  Object.keys(config).forEach(element => {
    if (config[element] instanceof Object) {
      configs.push({ 'command': element, element: config[element] })
    }
  });
  return [configs, config.projectName]
}

module.exports = checkDeployConfig 