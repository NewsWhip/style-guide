// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
process.env.CHROMIUM_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      {'reporter:jasmine-seed': ['type', JasmineSeedReporter]}
    ],
    client:{
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
        random: true,
        seed: ''
      }
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    
    reporters: ['progress', 'kjhtml', 'jasmine-seed'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['HeadlessChrome'],
      customLaunchers: {
          HeadlessChrome: {
              base: 'ChromiumHeadless',
              flags: [
                  '--no-sandbox',
                  '--headless=new'
              ]
          }
      },
    singleRun: false,
    sourcemap: true
  });
};

// Helpers
function JasmineSeedReporter(baseReporterDecorator) {
  baseReporterDecorator(this);

  this.onBrowserComplete = (browser, result) => {
    const seed = result.order && result.order.random && result.order.seed;
    if (seed) this.write(`${browser}: Randomized with seed ${seed}.\n`);
  };

  this.onRunComplete = () => undefined;
}
