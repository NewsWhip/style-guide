const fs = require('fs-extra');
const path = require('path');
const execSync = require('child_process').execSync;
const jsonPath = path.join('node_modules', '.bin', 'json');
const utils = require('./utils');

const run = () => {
    require('./build');

    process.stdout.write('Copying package.json file');

    const sourceFile = 'package.json';
    const destFile = path.join(utils.distPath, sourceFile);

    try {
        fs.copyFileSync(sourceFile, destFile);
        utils.onSuccess();
    } catch (err) {
        utils.onError();
        throw err;
    }

    process.stdout.write('Updating private field \n');

    try {
        execSync(`${jsonPath} -I -f ${destFile} -e this.private=false`)
    } catch(err) {
        throw err;
    }

    utils.logSeparator();

    if (process.argv.indexOf('nopublish') === -1) {
        process.stdout.write('Publishing package');

        try {
            execSync(`npm publish ${utils.distPath}`);
        } catch(err) {
            throw err;
        }
    }
}

run();

