/* Produces a .tgz package of the Style Guide for local use.
*  Useful for local testing, eliminates need to publish frequent beta versions.
* */
const execSync = require('child_process').execSync;
const utils = require('../utils');
const pjson = require('../package.json');

const run = () => {
    require('./build');
    require('./copy-package-file');

    process.stdout.write(`Navigating to ${utils.distPath} directory & compressing package \n`);

    try {
        execSync(`cd ${utils.distPath}; npm pack`);
    } catch(err) {
        throw err;
    }

    utils.logSeparator();

    const tgzAbsolutePath = `${process.cwd()}/${utils.distPath}${pjson.name}-${pjson.version}.tgz`;

    process.stdout.write(`
    Style Guide package path is:\n
    ${tgzAbsolutePath}\n
    Replace the nw-style-guide version in spike3/package.json with it to run locally. \n\n`
    );

    utils.logSeparator();
}

run();
