const execSync = require('child_process').execSync;
const utils = require('../utils');

const run = () => {
    require('./pack');

    process.stdout.write('Publishing package');

    try {
        execSync(`npm publish ${utils.distPath}`);
    } catch(err) {
        throw err;
    }
}

run();

