/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var os = require('os');

// use current ipv4 address to allow asset loading cross-network
var ifaces = os.networkInterfaces();
var ipv4AddressFamily = (ifaces.en0 || ifaces.eth0).filter(function(addObj) {
  return addObj.family === 'IPv4';
});
var ipv4Address = (ipv4AddressFamily ||  [{address: 'localhost'}])[0].address;

module.exports = function(defaults) {
  var env = EmberApp.env()|| 'development';
  var isProductionLikeBuild = ['production', 'staging'].indexOf(env) > -1;

  var fingerprintOptions = {
    enabled: true,
    extensions: ['js', 'css', 'png', 'jpg', 'gif']
  };

  switch (env) {
    case 'development':
      var address = (ifaces.en0 || ifaces.eth0).filter(function(addObj) { return addObj.family === 'IPv4' })[0].address
      fingerprintOptions.prepend = 'http://' + ipv4Address + ':4200/';
    break;
    case 'staging':
      fingerprintOptions.prepend = 'TODO';
    break;
    case 'production':
      fingerprintOptions.prepend = 'https://d34ffs4dj251fe.cloudfront.net/';
    break;
  }

  var app = new EmberApp(defaults, {
    fingerprint: fingerprintOptions,
    emberCLIDeploy: {
      runOnPostBuild: (env === 'development') ? 'development-postbuild' : false,
      shouldActivate: true
    },
    sourcemaps: {
      enabled: !isProductionLikeBuild,
    },
    minifyCSS: { enabled: isProductionLikeBuild },
    minifyJS: { enabled: isProductionLikeBuild },

    tests: process.env.EMBER_CLI_TEST_COMMAND || !isProductionLikeBuild,
    hinting: process.env.EMBER_CLI_TEST_COMMAND || !isProductionLikeBuild
  });

  return app.toTree();
};
