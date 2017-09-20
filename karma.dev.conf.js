// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html
const baseConfig = require('./karma.base.conf.js').baseConfig;

module.exports = function (config) {
  config.set(Object.assign({}, baseConfig, {
    browsers: ['Chrome'],
    singleRun: false,
    logLevel: config.LOG_INFO,
  }));
};
