// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
import { fileURLToPath } from 'url';
import path from 'path';
import karmaJasmine from 'karma-jasmine';
import karmaChromeLauncher from 'karma-chrome-launcher';
import karmaJasmineHtmlReporter from 'karma-jasmine-html-reporter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            karmaJasmine,
            karmaChromeLauncher,
            karmaJasmineHtmlReporter,
            { 'reporter:jasmine-seed': ['type', JasmineSeedReporter] }
        ],
        client: {
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
        reporters: ['progress', 'kjhtml', 'jasmine-seed'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        singleRun: false,
        sourcemap: true
    });
}

// Helpers
function JasmineSeedReporter(baseReporterDecorator) {
    baseReporterDecorator(this);

    this.onBrowserComplete = (browser, result) => {
        const seed = result.order && result.order.random && result.order.seed;
        if (seed) this.write(`${browser}: Randomized with seed ${seed}.\n`);
    };

    this.onRunComplete = () => undefined;
}
