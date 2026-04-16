/* Produces a .tgz package of the Style Guide for local use.
 *  Useful for local testing, eliminates need to publish frequent beta versions.
 * */
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import * as utils from '../utils.js';
import { readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const run = async () => {
    await import('./build.js');

    process.stdout.write(`Navigating to ${utils.distPath} directory & compressing package \n`);

    try {
        process.chdir(utils.distPath);
        execSync('npm pack');
    } catch (err) {
        throw err;
    }

    utils.logSeparator();

    const pjson = JSON.parse(readFileSync(path.join(__dirname, '..', utils.distPath, 'package.json'), 'utf8'));

    const tgzAbsolutePath = path.join(process.cwd(), `${pjson.name}-${pjson.version}.tgz`);

    process.stdout.write(`
    Style Guide package path is:\n
    ${tgzAbsolutePath}\n
    Replace the nw-style-guide version in spike3/package.json with it to run locally. \n\n`);

    utils.logSeparator();
};

run();
