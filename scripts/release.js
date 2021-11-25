const execSync = require('child_process').execSync;
const utils = require('../utils');

const run = () => {
    require('./build');
    require('./copy-package-file');

    process.stdout.write('Publishing package \n');

    try {
        execSync(`npm publish ${utils.distPath} --dry-run`);
    } catch(err) {
        throw err;
    }
}

run();

